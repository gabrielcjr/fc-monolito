import clientEntity from "../domain/client.entity";

export default interface ClientGateway {
    add(client: clientEntity): Promise<void>;
    find(id: string): Promise<clientEntity>;
}