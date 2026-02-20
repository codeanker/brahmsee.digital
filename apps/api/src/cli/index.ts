import { join, resolve } from "node:path";
import pdfmake from "pdfmake";
import { termost } from "termost";
import { syncAllPersonsToMeili } from "../meilisearch/person.js";
import { createAccount } from "./command/createAccount.js";
import { readFile } from "node:fs/promises";

pdfmake.addFonts({
  Inter: {
    normal: join(import.meta.dirname, './Inter-VariableFont_opsz,wght.ttf'),
  }
})

const image = await readFile(resolve(import.meta.dirname, '../../../frontend/src/assets/images/dilly_logo_sm.jpg'))
const imageBase64 = `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`

const program = termost({
  name: 'artisan',
  description: 'brahmsee.digital cli',
  version: process.env.VERSION ?? 'dev',
})

program
  .command({
    name: 'account:create',
    description: 'Create a new account',
  })
  .task({
    handler: async () => {
      await createAccount()
    }
  })

program
  .command({
    name: 'meilisearch:init',
    description: 'Initialize Meilisearch collections'
  })
  .task({
    handler: async () => {
      await syncAllPersonsToMeili()
    }
  })

program
  .command({
    name: 'db:seed',
    description: 'Seed the database with test data'
  })
  .task({
    handler: async () => {
      // TODO: Call seeder
    }
  })

program
  .command({
    name: 'pdf',
    description: 'Test pdf generation'
  })
  .task({
    handler: async () => {
      const pdf = pdfmake.createPdf({
        defaultStyle: {
          font: 'Inter',
        },
        pageMargins: [40, 66, 40, 56],
        content: [
          { margin: [0, 12], text: 'Moin Silas', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
          { margin: [0, 12], text: 'Lorem Ipsum Dolor Sit Amet', },
        ],
        header: {
          marginTop: 16,
          marginLeft: 40,
          marginRight: 40,
          columnGap: 16,
          fontSize: 10,
          columns: [
            {
              image: imageBase64,
              width: 48,
            },
            {
              text: 'brahmsee.digital',
              width: 'auto',
              marginTop: 5,
            }
          ],
        },
        footer: (currentPage, pageCount) => {
          return {
            fontSize: 10,
            columns: [
              { width: '*', text: '' },
              { width: 'auto', text: `${currentPage} / ${pageCount}`, },
              { width: '*', text: '' },
            ]
          }
        }
      })

      await pdf.write('file.pdf')
    }
  })
