import { NotePropsV2 } from "@dendronhq/common-all";
import {
  DendronASTDest,
  MDUtilsV4,
  RemarkChangeEntry,
  RemarkUtils,
} from "@dendronhq/engine-server";
// @ts-ignore
import throttle from "@jcoreio/async-throttle";
import _ from "lodash";
import yargs from "yargs";
import { CLICommand } from "./base";
import { CommandOptsV3 } from "./soil";
import { setupEngine, setupEngineArgs } from "./utils";

type CommandCLIOpts = {
  wsRoot: string;
  action: DoctorActions;
  enginePort?: number;
  query?: string;
  limit?: number;
  dryRun?: boolean;
};

type CommandOpts = CommandOptsV3 & CommandCLIOpts;
type CommandOutput = void;

export enum DoctorActions {
  H1_TO_TITLE = "h1ToTitle",
  HI_TO_H2 = "h1ToH2",
  // FIX_FM = "fixFM"
}

export class DoctorCLICommand extends CLICommand<CommandOpts, CommandOutput> {
  constructor() {
    super({ name: "doctor", desc: "doctor helps you fix your notes" });
  }

  buildArgs(args: yargs.Argv) {
    super.buildArgs(args);
    setupEngineArgs(args);
    args.option("actions", {
      describe: "what actions the doctor should take",
      type: "string",
      requiresArg: true,
      choices: Object.values(DoctorActions),
      // default: DoctorActions.FIX_FM
    });
    args.option("query", {
      describe: "run doctor over a query",
      type: "string",
    });
    args.option("limit", {
      describe: "limit num changes",
      type: "number",
    });
    args.option("dryRun", {
      describe: "dry run",
      type: "boolean",
    });
  }

  async enrichArgs(args: CommandCLIOpts): Promise<CommandOpts> {
    const engineArgs = await setupEngine(args);
    return { ...args, ...engineArgs };
  }

  async execute(opts: CommandOpts) {
    const { action, engine, query, limit, dryRun } = _.defaults(opts, {
      limit: 99999,
    });
    const proc = MDUtilsV4.procFull({
      dest: DendronASTDest.MD_DENDRON,
      engine,
      mathOpts: { katex: true },
    });
    let notes = query
      ? engine.queryNotesSync({ qs: query }).data
      : _.values(engine.notes);
    notes = notes.filter((n) => !n.stub);
    this.L.info({ msg: "prep doctor", numResults: notes.length });
    let numChanges = 0;
    let engineWrite = dryRun
      ? () => {}
      : throttle(_.bind(engine.writeNote, engine), 300, {
          leading: true,
        });

    let doctorAction: any;
    switch (action) {
      case DoctorActions.H1_TO_TITLE: {
        doctorAction = async (note: NotePropsV2) => {
          let changes: RemarkChangeEntry[] = [];
          const newBody = await proc()
            .use(RemarkUtils.h1ToTitle(note, changes))
            .process(note.body);
          note.body = newBody.toString();
          if (!_.isEmpty(changes)) {
            await engineWrite(note);
            this.L.info({ msg: `changes ${note.fname}`, changes });
            numChanges += 1;
            return;
          } else {
            return;
          }
        };
        break;
      }
      case DoctorActions.HI_TO_H2: {
        doctorAction = async (note: NotePropsV2) => {
          let changes: RemarkChangeEntry[] = [];
          const newBody = await proc()
            .use(RemarkUtils.h1ToH2(changes))
            .process(note.body);
          note.body = newBody.toString();
          if (!_.isEmpty(changes)) {
            await engineWrite(note);
            this.L.info({ msg: `changes ${note.fname}`, changes });
            numChanges += 1;
            return;
          } else {
            return;
          }
        };
        break;
      }
    }
    return _.reduce<any, Promise<any>>(
      notes,
      async (accInner, note) => {
        await accInner;
        if (numChanges >= limit) {
          return;
        }
        this.L.debug({ msg: `processing ${note.fname}` });
        return doctorAction(note);
      },
      Promise.resolve()
    );
    this.L.info({ msg: "doctor done", numChanges });
    return;
  }
}
