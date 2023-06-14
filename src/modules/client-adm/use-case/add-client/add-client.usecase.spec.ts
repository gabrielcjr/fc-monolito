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
            document: "00000000000",
            street: "Main St",
            number: "1234",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "00000000",
        }

        const result = await useCase.execute(input)


        expect(repository.add).toHaveBeenCalled()
        expect (result.id).toBeDefined()
        expect (result.name).toEqual(input.name)
        expect (result.email).toEqual(input.email)
        expect (result.document).toEqual(input.document)
        expect (result.street).toEqual(input.street)
        expect (result.number).toEqual(input.number)
        expect (result.complement).toEqual(input.complement)
        expect (result.city).toEqual(input.city)
        expect (result.state).toEqual(input.state)
        expect (result.zipCode).toEqual(input.zipCode)
})
})