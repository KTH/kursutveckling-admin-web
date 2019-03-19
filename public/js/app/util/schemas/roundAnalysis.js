'use strict'

import { Schema } from 'isomorphic-schema'
import ListField from 'isomorphic-schema/lib/field_validators/ListField'
import BoolField from 'isomorphic-schema/lib/field_validators/BoolField'
import TextField from 'isomorphic-schema/lib/field_validators/TextField'
import ObjectField from 'isomorphic-schema/lib/field_validators/ObjectField'

const i18n = require('isomorphic-schema').i18n

const roundAnalysisSchema = new Schema('roundAnalysisSchema', {
  courseCode: new TextField({
    readOnly: true
  }),
  active: new BoolField({
    label: i18n('source_item_label__active', 'Show')
  })
})

const listSchema = new Schema('sourceListSchema', {
  sources: new ListField({
    valueType: new ObjectField({
      schema: listItemSchema
    })
  })
})

module.exports = listSchema
