import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { MasterDataClient, MasterDataService } from './master-data';
import { RoleClient, RoleService } from './role';
import { UserClient, UserService } from './user';

export * from './role';
export * from './user';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  user_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
}
class ApplicationContext {
  roleService?: RoleClient;
  userService?: UserService;
  masterDataService?: MasterDataService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getRoleService = this.getRoleService.bind(this);
    this.getUserService = this.getUserService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }
  getRoleService(): RoleService {
    if (!this.roleService) {
      const c = this.getConfig();
      this.roleService = new RoleClient(httpRequest, c.role_url, c.privilege_url);
    }
    return this.roleService;
  }
  getUserService(): UserService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new UserClient(httpRequest, c.user_url);
    }
    return this.userService;
  }
  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }
}

export const context = new ApplicationContext();
export function getRoleService(): RoleService {
  return context.getRoleService();
}
export function getUserService(): UserService {
  return context.getUserService();
}
export function getMasterData(): MasterDataService {
  return context.getMasterDataService();
}
