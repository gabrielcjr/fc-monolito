import Client from "../../domain/client.entity"
import AddClientUseCase from "./add-client.usecase"

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
}

describe("Add client use case", () => {
    it("should add a client", async () => {
        const repository = MockRepository()
        const useCase = new AddClientUseCase(repository)

        const input = {
            name: "John Doe",
            email: "sdfgb@wreg.com",
            address: "1234 Main St",
        }

        const result = await useCase.execute(input)


        expect(repository.add).toHaveBeenCalled()
        expect (result.id).toBeDefined()
        expect (result.name).toEqual(input.name)
        expect (result.email).toEqual(input.email)
        expect (result.address).toEqual(input.address)
})
})