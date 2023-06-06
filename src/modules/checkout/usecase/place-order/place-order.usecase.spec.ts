import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";


describe("PlaceOrderUseCase", () => {

    describe("execute method", () => {

        it("should throw an error when client is not found", async () => {
         
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;
            
            const input: PlaceOrderInputDto = { clientId: "0", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
                new Error("Client not found")
            );
        })

        it("should throw an error when product are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };
            //@ts-expected-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProduct")
            //@ts-expect-error - not return never
            .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: "1", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
                new Error("No products selected")
            );
            expect(mockValidateProduct).toHaveBeenCalledTimes(1);
        })


    })


})