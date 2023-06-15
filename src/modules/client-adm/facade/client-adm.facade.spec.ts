import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../use-case/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAmdFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })
    
    it("Should create a client", async () => {
        const repository = new ClientRepository();
        const addUsecase = new AddClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUsecase: addUsecase,
            findUsecase: undefined,
        });

        const input = {
            id: "2",
            name: "Client 1",
            email: "x@x.com",
            street: "Main St",
            number: "1234",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "00000000",
            document: "00000000000",
        }

        await facade.add(input)

        const client = await ClientModel.findOne({where: {id: "2"}})

        expect(client).toBeDefined()
        expect(client.id).toEqual(input.id)
        expect(client.name).toEqual(input.name)
        expect(client.email).toEqual(input.email)
        expect(client.street).toEqual(input.street)
        expect(client.number).toEqual(input.number)
        expect(client.complement).toEqual(input.complement)
        expect(client.city).toEqual(input.city)
        expect(client.state).toEqual(input.state)
        expect(client.zipCode).toEqual(input.zipCode)
        expect(client.document).toEqual(input.document)
    })

    it("Should find a client", async () => {
        const facade = ClientAdmFacadeFactory.create()

        const input = {
            id: "2",
            name: "Client 1",
            email: "x@x.com",
            street: "Main St",
            number: "1234",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "00000000",
            document: "00000000000",
        }

        await facade.add(input)

        const client = await facade.find({id: "2"})

        expect(client).toBeDefined()
        expect(client.id).toEqual(input.id)
        expect(client.name).toEqual(input.name)
        expect(client.email).toEqual(input.email)
        expect(client.street).toEqual(input.street)
        expect(client.number).toEqual(input.number)
        expect(client.complement).toEqual(input.complement)
        expect(client.city).toEqual(input.city)
        expect(client.state).toEqual(input.state)
        expect(client.zipCode).toEqual(input.zipCode)
    })
})