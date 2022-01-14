import {
  DendronConfigEntry,
  DendronConfigEntryCollection,
} from "../../types/configs/base";
import { DendronCommandConfig } from "../../types/configs/commands/commands";
import {
  LookupConfig,
  NoteLookupConfig,
  LookupSelectionModeEnum,
} from "../../types/configs/commands/lookup";
import { RandomNoteConfig } from "../../types/configs/commands/randomNote";
import { InsertNoteConfig } from "../../types/configs/commands/insertNote";
import {
  InsertNoteLinkConfig,
  InsertNoteLinkAliasModeEnum,
} from "../../types/configs/commands/insertNoteLink";
import { InsertNoteIndexConfig } from "../../types/configs/commands/insertNoteIndex";

/**
 * Lookup
 */

/**
 * Selection mode entries
 */
export const SELECTION_MODES: Record<
  LookupSelectionModeEnum,
  DendronConfigEntry<string>
> = {
  [LookupSelectionModeEnum.extract]: {
    value: LookupSelectionModeEnum.extract,
    label: "Extract Selection",
    desc: "Extract selection of active editor and use it as body of new note.",
  },
  [LookupSelectionModeEnum.link]: {
    value: LookupSelectionModeEnum.link,
    label: "Selection to Link",
    desc: "Use selection of active editor for the basename of the lookup value.",
  },
  [LookupSelectionModeEnum.none]: {
    value: LookupSelectionModeEnum.none,
    label: "None",
    desc: "Do not set selection mode",
  },
};

/**
 * Note lookup entry collection
 */
const NOTE: DendronConfigEntryCollection<NoteLookupConfig> = {
  selectionMode: SELECTION_MODES,
  confirmVaultOnCreate: {
    label: "Confirm Vault on Create.",
    desc: "Prompt for vault selection when creating new note.",
  },
  selectVaultModeOnCreate: {
    label: "Vault Selection Mode On Note Creation.",
    desc: "Whether to smartly guess the vault for the note when creating new note.",
  },
  leaveTrace: {
    label: "Leave Trace",
    desc: "Leaves a reference of the destination note in the source note while using selectionExtract",
  },
  bubbleUpCreateNew: {
    label: "Bubble Up Create New",
    desc: "Put `Create New` at the top of the lookup result.",
  },
  fuzzThreshold: {
    label: "Fuzziness Threshold For Lookup",
    desc: "Sets the fuzziness level of lookup",
  },
};

/**
 * Lookup entry collection
 */
const LOOKUP: DendronConfigEntryCollection<LookupConfig> = {
  note: NOTE,
};

/**
 * Random note
 */

/**
 * Random note entries
 */
const RANDOM_NOTE: DendronConfigEntryCollection<RandomNoteConfig> = {
  include: {
    label: "Hierarchies to Include",
    desc: "Hierarchies to include when opening a random note",
  },
  exclude: {
    label: "hierarchies to Exclude",
    desc: "Hierarchies not to include when opening a random note",
  },
};

/**
 * Insert note
 */

/**
 * Insert note entries
 */
const INSERT_NOTE: DendronConfigEntryCollection<InsertNoteConfig> = {
  initialValue: {
    label: "Initial Value",
    desc: "Initial value that will be filled when prompted.",
  },
};

/**
 * Insert note link
 */

/**
 * Insert note link alias mode entries
 */
const ALIAS_MODES: Record<
  InsertNoteLinkAliasModeEnum,
  DendronConfigEntry<string>
> = {
  [InsertNoteLinkAliasModeEnum.snippet]: {
    value: InsertNoteLinkAliasModeEnum.snippet,
    label: "Snippet Mode",
    desc: "Insert note link as snippet string",
  },
  [InsertNoteLinkAliasModeEnum.selection]: {
    value: InsertNoteLinkAliasModeEnum.selection,
    label: "Selection Mode",
    desc: "Extract selection and use as link alias",
  },
  [InsertNoteLinkAliasModeEnum.title]: {
    value: InsertNoteLinkAliasModeEnum.title,
    label: "Title Mode",
    desc: "Use linked note's title as link alias",
  },
  [InsertNoteLinkAliasModeEnum.prompt]: {
    value: InsertNoteLinkAliasModeEnum.prompt,
    label: "Prompt Mode",
    desc: "Prompt for input to be used as link alias",
  },
  [InsertNoteLinkAliasModeEnum.none]: {
    value: InsertNoteLinkAliasModeEnum.none,
    label: "No Alias Mode",
    desc: "Do not add link alias",
  },
};

/**
 * Insert note link entries
 */
const INSERT_NOTE_LINK: DendronConfigEntryCollection<InsertNoteLinkConfig> = {
  aliasMode: ALIAS_MODES,
  enableMultiSelect: {
    label: "Enable Multi-select",
    desc: "Enable multi-select when inserting note links",
  },
};

/**
 * Insert note index
 */

/**
 * Insert note index entries
 */
export const INSERT_NOTE_INDEX: DendronConfigEntryCollection<InsertNoteIndexConfig> =
  {
    enableMarker: {
      label: `Enable Marker`,
      desc: `Insert note index between autogenerated markers`,
    },
  };

/**
 * Command entry collection
 */
export const COMMANDS: DendronConfigEntryCollection<DendronCommandConfig> = {
  lookup: LOOKUP,
  randomNote: RANDOM_NOTE,
  insertNote: INSERT_NOTE,
  insertNoteLink: INSERT_NOTE_LINK,
  insertNoteIndex: INSERT_NOTE_INDEX,
};
