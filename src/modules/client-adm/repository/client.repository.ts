import Id from "../../@shared/domain/value-object/id.value-object";
import clientEntity from "../domain/client.entity";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {

    add(client: clientEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async find(id: string): Promise<clientEntity> {
        const client = await ClientModel.findOne({ where: {id}})

        if(!client) {
            throw new Error("Client not found")
        }

        return new Client ({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        })
    }

}