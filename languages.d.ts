// Type definitions for languages module
// Internal module for osrm-text-instructions

export interface LanguagesModule {
  /**
   * Array of supported language codes
   */
  supportedCodes: string[];

  /**
   * Instruction data for all supported languages and versions
   */
  instructions: InstructionsData;

  /**
   * Grammar rules for languages that support them
   */
  grammars: GrammarsData;

  /**
   * Abbreviation mappings for supported languages
   */
  abbreviations: AbbreviationsData;
}

export interface InstructionsData {
  [languageCode: string]: LanguageInstructions;
}

export interface LanguageInstructions {
  /**
   * Language metadata
   */
  meta?: LanguageMeta;

  /**
   * Version-specific instruction data
   */
  [version: string]: VersionInstructions | LanguageMeta | undefined;
}

export interface LanguageMeta {
  /**
   * Whether to capitalize the first letter of instructions
   */
  capitalizeFirstLetter?: boolean;

  /**
   * Regular expression flags for grammar rules
   */
  regExpFlags?: string;
}

export interface VersionInstructions {
  /**
   * Constants used in instruction generation
   */
  constants?: InstructionConstants;

  /**
   * Mode-specific instructions (e.g., ferry)
   */
  modes?: ModeInstructions;

  /**
   * Phrase templates for complex instructions
   */
  phrase?: PhraseTemplates;

  /**
   * Maneuver type instructions
   */
  [maneuverType: string]: ManeuverInstructions | InstructionConstants | ModeInstructions | PhraseTemplates | undefined;
}

export interface InstructionConstants {
  /**
   * Ordinal numbers (1st, 2nd, 3rd, etc.)
   */
  ordinalize?: { [number: string]: string };

  /**
   * Compass directions
   */
  direction?: {
    north: string;
    northeast: string;
    east: string;
    southeast: string;
    south: string;
    southwest: string;
    west: string;
    northwest: string;
  };

  /**
   * Maneuver modifiers
   */
  modifier?: {
    left: string;
    right: string;
    'sharp left': string;
    'sharp right': string;
    'slight left': string;
    'slight right': string;
    straight: string;
    uturn: string;
  };

  /**
   * Lane configuration instructions
   */
  lanes?: { [config: string]: string };
}

export interface ModeInstructions {
  [mode: string]: {
    default: string;
    name?: string;
    destination?: string;
  };
}

export interface PhraseTemplates {
  'two linked by distance'?: string;
  'two linked'?: string;
  'one in distance'?: string;
  'name and ref'?: string;
  'exit with number'?: string;
  [key: string]: string | undefined;
}

export interface ManeuverInstructions {
  default?: InstructionVariants;
  [modifier: string]: InstructionVariants | undefined;
}

export interface InstructionVariants {
  default?: string;
  name?: string;
  destination?: string;
  exit?: string;
  exit_destination?: string;
  junction_name?: string;
  named?: string;
  upcoming?: string;
  short?: string;
  'short-upcoming'?: string;
  name_exit?: string;
  no_lanes?: string;
  distance?: string;
  namedistance?: string;
  [key: string]: string | undefined;
}

export interface GrammarsData {
  [languageCode: string]: LanguageGrammar;
}

export interface LanguageGrammar {
  /**
   * Grammar metadata
   */
  meta?: {
    regExpFlags?: string;
  };

  /**
   * Version-specific grammar rules
   */
  [version: string]: GrammarRules | { regExpFlags?: string } | undefined;
}

export interface GrammarRules {
  [grammarType: string]: Array<[string, string]>;
}

export interface AbbreviationsData {
  [languageCode: string]: {
    [term: string]: string;
  };
}

declare const languages: LanguagesModule;
export default languages; 