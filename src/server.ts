import './infra/utils/module-alias'

import { Server } from '@overnightjs/core'
import { Application, json } from 'express'
import { ForecastController } from './controllers/forecast-controller'
import { BeachesController } from './controllers/beaches-controller'
import { Database } from './database'
import { UsersController } from './controllers/users-controller'
import { Logger } from './infra/logger'

export class SetupServer extends Server {
  private port: number

  constructor (port = 3000) {
    super()
    this.port = port
  }

  public async init (): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await this.setupDatabase()
  }

  public start (msg: string): void {
    this.app.listen(this.port, () => {
      Logger.info('[NODE_ENV]: ' +  process.env.NODE_ENV)
      Logger.info('[SERVER INFO]: ' + msg)
    })
  }

  public getApp (): Application {
    return this.app
  }

  private setupExpress (): void {
    this.app.use(json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    const usersController = new UsersController()

    // 'addControllers' da classe pai 'Server'
    this.addControllers([
      forecastController,
      beachesController,
      usersController
    ])
  }

  private async setupDatabase (): Promise<void> {
    try {
      await Database.connect()
    } catch (error) {
      Logger.log('[DATABASE] Database connection error: ', error)
      process.exit(1)
    }
  }

  public async stop (): Promise<void> {
    await Database.disconnect()
  }
}
