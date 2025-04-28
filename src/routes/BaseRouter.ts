import { Router } from 'express';
import { BaseController } from '../controllers/BaseController';

export abstract class BaseRouter {
  protected router: Router;
  protected controller: BaseController;

  constructor(controller: BaseController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
} 