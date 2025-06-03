// Type definitions for osrm-text-instructions
// Project: https://github.com/Project-OSRM/osrm-text-instructions
// Definitions by: Generated

export = osrmTextInstructions;

declare function osrmTextInstructions(version: string): osrmTextInstructions.OSRMTextInstructions;

declare namespace osrmTextInstructions {
  /**
   * Main interface for OSRM Text Instructions compiler
   */
  interface OSRMTextInstructions {
    /**
     * Capitalizes the first letter of a string according to language rules
     * @param language - Language code (e.g., 'en', 'fr', 'de')
     * @param string - String to capitalize
     * @returns Capitalized string
     */
    capitalizeFirstLetter(language: string, string: string): string;

    /**
     * Converts a number to its ordinalized form in the given language
     * @param language - Language code
     * @param number - Number to ordinalize
     * @returns Ordinalized string (e.g., "1st", "2nd", "3rd")
     */
    ordinalize(language: string, number: number): string;

    /**
     * Converts degrees to compass direction in the given language
     * @param language - Language code
     * @param degree - Bearing in degrees (0-360)
     * @returns Compass direction string
     */
    directionFromDegree(language: string, degree: number): string;

    /**
     * Generates a lane configuration string from step data
     * @param step - Route step with intersection data
     * @returns Lane configuration string (e.g., "xo", "ox")
     */
    laneConfig(step: RouteStep): string;

    /**
     * Extracts and formats way name from step data
     * @param language - Language code
     * @param step - Route step data
     * @param options - Formatting options
     * @returns Formatted way name
     */
    getWayName(language: string, step: RouteStep, options?: CompileOptions): string;

    /**
     * Compiles a localized text instruction from a route step
     * @param language - Language code
     * @param step - Route step including maneuver property
     * @param options - Additional compilation options
     * @returns Localized text instruction
     */
    compile(language: string, step: RouteStep, options?: CompileOptions): string;

    /**
     * Applies grammar rules to a name based on language-specific rules
     * @param language - Language code
     * @param name - Name to grammaticalize
     * @param grammar - Grammar rule identifier
     * @returns Grammaticalized name
     */
    grammarize(language: string, name: string, grammar?: string): string;

    /**
     * Tokenizes an instruction string by replacing tokens with values
     * @param language - Language code
     * @param instruction - Instruction template with tokens
     * @param tokens - Token values to replace
     * @param options - Tokenization options
     * @returns Processed instruction string
     */
    tokenize(language: string, instruction: string, tokens: TokenValues, options?: CompileOptions): string;

    /**
     * Available abbreviations for all supported languages
     */
    abbreviations: LanguageAbbreviations;
  }

  /**
   * Options for compiling instructions
   */
  interface CompileOptions {
    /**
     * Number of legs in the route
     */
    legCount?: number;

    /**
     * Zero-based index of the leg containing the step
     */
    legIndex?: number;

    /**
     * List of road classes (e.g., ['motorway'])
     */
    classes?: string[];

    /**
     * Custom name for the leg's destination
     */
    waypointName?: string;

    /**
     * Function to format token values before insertion
     * @param token - Token type (e.g., 'way_name', 'direction')
     * @param value - Token value after grammaticalization
     * @returns Formatted token value
     */
    formatToken?: (token: string, value: string) => string;
  }

  /**
   * Route step object as defined by OSRM
   */
  interface RouteStep {
    /**
     * Maneuver instruction
     */
    maneuver: StepManeuver;

    /**
     * Travel mode (e.g., 'driving', 'walking')
     */
    mode?: string;

    /**
     * Driving side ('left' or 'right')
     */
    driving_side?: 'left' | 'right';

    /**
     * Way name
     */
    name?: string;

    /**
     * Way reference
     */
    ref?: string;

    /**
     * Destinations (semicolon-separated)
     */
    destinations?: string;

    /**
     * Exits (semicolon-separated)
     */
    exits?: string;

    /**
     * Rotary/roundabout name
     */
    rotary_name?: string;

    /**
     * Junction name
     */
    junction_name?: string;

    /**
     * Intersections array
     */
    intersections?: Intersection[];
  }

  /**
   * Step maneuver information
   */
  interface StepManeuver {
    /**
     * Maneuver type
     */
    type: ManeuverType;

    /**
     * Maneuver modifier
     */
    modifier?: ManeuverModifier;

    /**
     * Exit number for roundabouts
     */
    exit?: number;

    /**
     * Bearing after the maneuver in degrees
     */
    bearing_after?: number;
  }

  /**
   * Intersection with lane information
   */
  interface Intersection {
    /**
     * Lane information
     */
    lanes?: Lane[];
  }

  /**
   * Individual lane information
   */
  interface Lane {
    /**
     * Whether the lane is valid for the maneuver
     */
    valid: boolean;
  }

  /**
   * Token values for instruction templating
   */
  interface TokenValues {
    way_name?: string;
    destination?: string;
    exit?: string;
    exit_number?: string;
    rotary_name?: string;
    lane_instruction?: string;
    modifier?: string;
    direction?: string;
    nth?: string;
    waypoint_name?: string;
    junction_name?: string;
    [key: string]: string | undefined;
  }

  /**
   * Supported maneuver types
   */
  type ManeuverType =
    | 'turn'
    | 'new name'
    | 'depart'
    | 'arrive'
    | 'merge'
    | 'on ramp'
    | 'off ramp'
    | 'fork'
    | 'end of road'
    | 'continue'
    | 'roundabout'
    | 'rotary'
    | 'roundabout turn'
    | 'notification'
    | 'exit roundabout'
    | 'exit rotary'
    | 'use lane';

  /**
   * Supported maneuver modifiers
   */
  type ManeuverModifier =
    | 'uturn'
    | 'sharp right'
    | 'right'
    | 'slight right'
    | 'straight'
    | 'slight left'
    | 'left'
    | 'sharp left';

  /**
   * Supported language codes
   */
  type SupportedLanguage =
    | 'ar'
    | 'ca'
    | 'da'
    | 'de'
    | 'en'
    | 'eo'
    | 'es'
    | 'es-ES'
    | 'fi'
    | 'fr'
    | 'he'
    | 'hu'
    | 'id'
    | 'it'
    | 'ja'
    | 'ko'
    | 'my'
    | 'nl'
    | 'no'
    | 'pl'
    | 'pt-BR'
    | 'pt-PT'
    | 'ro'
    | 'ru'
    | 'sl'
    | 'sv'
    | 'tr'
    | 'uk'
    | 'vi'
    | 'yo'
    | 'zh-Hans';

  /**
   * Language abbreviations mapping
   */
  interface LanguageAbbreviations {
    [languageCode: string]: {
      [term: string]: string;
    };
  }
} 