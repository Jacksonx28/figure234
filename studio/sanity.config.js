import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'figure234ng',
  projectId: 'cfktf6lt',
  dataset: 'figure234',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})