import {ResourceService} from "./resource.service";
import {EntityManager} from "@mikro-orm/core";

export class Services {
    resourceService: ResourceService;
    constructor(em:EntityManager) {
        this.resourceService = new ResourceService(em);
    }
}