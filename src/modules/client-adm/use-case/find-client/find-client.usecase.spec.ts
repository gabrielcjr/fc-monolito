import Id from "../../../@shared/domain/value-object/id.value-object"
import FindClientUseCase from "./find-client.usecase"

const client = {
    id: new Id("1"),
    name: "John Doe",
    email: "x@x.com",
    address: "1234 Main St",
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
        expect(result.address).toEqual(client.address)
        expect(result.createdAt).toEqual(client.createdAt)
        expect(result.updatedAt).toEqual(client.updatedAt)
    })
})

