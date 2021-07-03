// hanya untuk coba coba saja, silahkan di hapus jika ingin

import delay from "delay"

/* eslint-disable @typescript-eslint/no-empty-function */
import { Listr } from "listr2"
import { Logger } from "listr2/dist/utils/logger"

interface Ctx {
  input: boolean | Record<string, boolean>
}

const logger = new Logger({ useIcons: false })

async function main (): Promise<void> {
  let task: Listr<Ctx>

  logger.start("Example for getting user input.")

  task = new Listr<Ctx>(
    [
      {
        title: "Now I will show the input value.",
        task: (ctx, task): void => {
          task.output = JSON.stringify(ctx.input)
        },
        options: {
          persistentOutput: true
        }
      }
    ],
    { concurrent: false }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }

  logger.start("You can go ahead with complicated functions with prompts as well.")
  task = new Listr<Ctx>(
    [
      {
        title: "This task will get your input.",
        task: async (ctx, task): Promise<void> => {
          ctx.input = await task.prompt<boolean>({ type: "Toggle", message: "Do you love me?" })
          // do something
          if (ctx.input === false) {
            throw new Error(":/")
          }
        }
      }
    ],
    { concurrent: false }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }

  logger.start("More complicated prompt.")
  task = new Listr<Ctx>(
    [
      {
        title: "This task will get your input.",
        task: async (ctx, task): Promise<void> => {
          ctx.input = await task.prompt<boolean>({
            type: "Select",
            message: "Do you love me?",
            choices: [ "test", "test", "test", "test" ]
          })
          task.output = `${ctx.input}`
        },
        options: {
          persistentOutput: true
        }
      }
    ],
    { concurrent: false }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }

  logger.start("Very complicated prompt.")
  task = new Listr<Ctx>(
    [
      {
        title: "This task will get your input.",
        task: async (ctx, task): Promise<void> => {
          ctx.input = await task.prompt({
            type: "Survey",
            message: "Please rate your experience",
            scale: [
              { name: "1", message: "Strongly Disagree" },
              { name: "2", message: "Disagree" },
              { name: "3", message: "Neutral" },
              { name: "4", message: "Agree" },
              { name: "5", message: "Strongly Agree" }
            ],
            margin: [ 0, 0, 2, 1 ],
            choices: [
              {
                name: "interface",
                message: "The website has a friendly interface."
              },
              {
                name: "navigation",
                message: "The website is easy to navigate."
              },
              {
                name: "images",
                message: "The website usually has good images."
              },
              {
                name: "upload",
                message: "The website makes it easy to upload images."
              },
              {
                name: "colors",
                message: "The website has a pleasing color palette."
              }
            ]
          })
        }
      }
    ],
    { concurrent: false }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }

  logger.start("Skipping a prompt.")
  task = new Listr<Ctx>(
    [
      {
        title: "This task will execute.",
        task: async (ctx, task): Promise<void> => {
          delay(1000).then(() => task.skip("Skip this task."))
          ctx.input = await task.prompt({
            type: "Input",
            message: "Give me some input."
          })
        }
      },

      {
        title: "Another task.",
        task: async (): Promise<void> => {
          await delay(1000)
        }
      }
    ],
    {
      concurrent: false
    }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }

  logger.start("Canceling a prompt.")
  task = new Listr<Ctx>(
    [
      {
        title: "This task will execute and cancel the prompts.",
        task: async (ctx, task): Promise<void> => {
          delay(1000).then(() => task.cancelPrompt())
          ctx.input = await task.prompt({
            type: "Input",
            message: "Give me input before it disappears."
          })

          delay(1000).then(() => task.cancelPrompt())
          ctx.input = await task.prompt([
            {
              name: "hello",
              type: "Input",
              message: "This one will disappear."
            },
            {
              name: "hello2",
              type: "Input",
              message: "But this one won\"t."
            }
          ])

          delay(1000).then(() => task.cancelPrompt(true))
          ctx.input = await task.prompt({
            type: "Input",
            message: "This input will throw an error :/."
          })
        }
      },
      {
        title: "Another task.",
        task: async (ctx, task): Promise<void> => {
          ctx.input = await task.prompt({
            type: "Input",
            message: "Prompt afterwards."
          })
          await delay(1000)
        }
      }
    ],
    {
      concurrent: false
    }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }
}

main()