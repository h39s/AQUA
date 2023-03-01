/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Heavily modified from the validator generated from @rkesters/typescript-json-validator
const Ajv = require('ajv');

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  removeAdditional: false,
  strict: false,
  strictNumbers: false,
  strictRequired: false,
  strictSchema: false,
  strictTuples: false,
  strictTypes: false,
  useDefaults: true,
});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const IStateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  defaultProperties: [],
  definitions: {
    FilterTypeEnum: {
      enum: ['HSC', 'LSC', 'PK'],
      type: 'string',
    },
    IFiltersMap: {
      additionalProperties: {
        $ref: '#/definitions/IFilter',
      },
      defaultProperties: [],
      description: '----- Application Interfaces -----',
      type: 'object',
    },
    IFilter: {
      defaultProperties: [],
      properties: {
        frequency: {
          type: 'number',
        },
        gain: {
          type: 'number',
        },
        id: {
          type: 'string',
        },
        quality: {
          type: 'number',
        },
        type: {
          $ref: '#/definitions/FilterTypeEnum',
        },
      },
      required: ['frequency', 'gain', 'id', 'quality', 'type'],
      type: 'object',
    },
  },
  properties: {
    filters: {
      $ref: '#/definitions/IFiltersMap',
    },
    isAutoPreAmpOn: {
      type: 'boolean',
    },
    isEnabled: {
      type: 'boolean',
    },
    isGraphViewOn: {
      type: 'boolean',
    },
    preAmp: {
      type: 'number',
    },
  },
  required: [
    'filters',
    'isAutoPreAmpOn',
    'isEnabled',
    'isGraphViewOn',
    'preAmp',
  ],
  type: 'object',
};

export const IPresetSchemaV1 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  defaultProperties: [],
  definitions: {
    FilterTypeEnum: {
      enum: ['HSC', 'LSC', 'PK'],
      type: 'string',
    },
    IFilter: {
      defaultProperties: [],
      properties: {
        frequency: {
          type: 'number',
        },
        gain: {
          type: 'number',
        },
        id: {
          type: 'string',
        },
        quality: {
          type: 'number',
        },
        type: {
          $ref: '#/definitions/FilterTypeEnum',
        },
      },
      required: ['frequency', 'gain', 'id', 'quality', 'type'],
      type: 'object',
    },
  },
  properties: {
    filters: {
      items: {
        $ref: '#/definitions/IFilter',
      },
      type: 'array',
    },
    preAmp: {
      type: 'number',
    },
  },
  required: ['filters', 'preAmp'],
  type: 'object',
};

const IPresetSchemaV2 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  defaultProperties: [],
  definitions: {
    FilterTypeEnum: {
      enum: ['HSC', 'LSC', 'PK'],
      type: 'string',
    },
    Filters: {
      additionalProperties: {
        $ref: '#/definitions/IFilter',
      },
      defaultProperties: [],
      description: '----- Application Interfaces -----',
      type: 'object',
    },
    IFilter: {
      defaultProperties: [],
      properties: {
        frequency: {
          type: 'number',
        },
        gain: {
          type: 'number',
        },
        id: {
          type: 'string',
        },
        quality: {
          type: 'number',
        },
        type: {
          $ref: '#/definitions/FilterTypeEnum',
        },
      },
      required: ['frequency', 'gain', 'id', 'quality', 'type'],
      type: 'object',
    },
  },
  properties: {
    filters: {
      $ref: '#/definitions/Filters',
    },
    preAmp: {
      type: 'number',
    },
  },
  required: ['filters', 'preAmp'],
  type: 'object',
};

export const validateState = ajv.compile(IStateSchema);
export const validatePresetV1 = ajv.compile(IPresetSchemaV1);
export const validatePresetV2 = ajv.compile(IPresetSchemaV2);
