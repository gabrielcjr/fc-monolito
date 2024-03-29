import Id from "../../../@shared/domain/value-object/id.value-object"
import FindClientUseCase from "./find-client.usecase"

const client = {
    id: new Id("1"),
    name: "John Doe",
    email: "x@x.com",
    document: "123456789",
    street: "Rua 1",
    number: "123",
    complement: "Casa",
    city: "São Paulo",
    state: "SP",
    zipCode: "12345678",
    createdAt: new Date(),
    updatedAt: new Date()
}

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    }
}

describe("Find client use case", () => {
    it("should find a client", async () => {
        const repository = MockRepository()
        const usecase = new FindClientUseCase(repository)

        const input = {
            id: "1",
        }

        const result = await usecase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect (result.id).toEqual(input.id)
        expect(result.name).toEqual(client.name)
        expect(result.email).toEqual(client.email)
        expect(result.document).toEqual(client.document)
        expect(result.street).toEqual(client.street)
        expect(result.number).toEqual(client.number)
        expect(result.complement).toEqual(client.complement)
        expect(result.city).toEqual(client.city)
        expect(result.state).toEqual(client.state)
        expect(result.zipCode).toEqual(client.zipCode)
        expect(result.createdAt).toEqual(client.createdAt)
        expect(result.updatedAt).toEqual(client.updatedAt)
    })
})

