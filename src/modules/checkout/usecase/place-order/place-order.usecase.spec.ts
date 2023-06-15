import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase", () => {

    describe("validateProducts method", () => {
        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw error if no products are selected", async () => {
            const input: PlaceOrderInputDto = { clientId: "0", products: [] }

            await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrowError(
                new Error("No products selected")
            );
        });

        it("should throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => 
                    Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1,
                }),
            ),
        }
            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = { 
                clientId: "0", 
                products: [{productId: "1"}] ,
            };

            await expect (placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}],
            };

            await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}, {productId: "2"}],
            };

            await expect(placeOrderUseCase["validateProduct"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);

        })
    });

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        })

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProducts"]("0")).rejects.toThrowError(
                new Error("Product not found")
            );
        })

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0,
                }),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProducts"]("0")).resolves.toEqual(
                new Product({
                id: new Id("0"),
                name: "Product 0",
                description: "Product 0 description",
                salesPrice: 0,
            }));
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);

        })
    })

    describe("execute method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        })

        it("should throw an error when client is not found", async () => {
         
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - no params in constructor
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
            //@ts-expect-error - no params in constructor
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

        describe("place an order", () => {
            const clientProps = {
                id: "1c",
                name: "Client 1",
                document: "00000000000",
                email: "client@user.com",
                street: "Client street",
                number: "1",
                complement: "Client complement",
                city: "Client city",
                state: "Client state",
                zipCode: "00000000",
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            }

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
                findOrder: jest.fn(),
            }

            const mockInvoiceFacade = {
                generate: jest.fn(),
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 1,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Product 2 description",
                    salesPrice: 2,
                }),
            };

            const mockValidateProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProduct")
            //@ts-expect-error - spy on private method
            .mockResolvedValue(null);

            const mockGetProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProducts")
            //@ts-expect-error - not return never
            .mockImplementation((productId: keyof typeof products) => {
                return Promise.resolve(products[productId]);
            })

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        {productId: "1"},
                        {productId: "2"},
                    ],
                }

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(3);
                expect(output.products).toStrictEqual([
                    { id: "1"},
                    { id: "2"},
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
                expect(mockValidateProduct).toHaveBeenCalledTimes(1);
                expect(mockValidateProduct).toHaveBeenCalledWith(input);
                expect(mockGetProducts).toHaveBeenCalledTimes(2);
                // expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                })
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);

            })

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
    
                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}],
                }
    
                let output = await placeOrderUseCase.execute(input);
    
                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(3);
                expect(output.products).toStrictEqual([
                    {id: "1"},
                    {id: "2"},
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
                expect(mockValidateProduct).toHaveBeenCalledTimes(1);
                expect(mockGetProducts).toHaveBeenCalledTimes(2);
                // expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                })
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: "Client 1",
                    document: "00000000000",
                    street: "Client street",
                    number: "1",
                    complement: "Client complement",
                    city: "Client city",
                    state: "Client state",
                    zipCode: "00000000",
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            description: products["1"].description,
                            price: products["1"].salesPrice,
                          },
                          {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            description: products["2"].description,
                            price: products["2"].salesPrice
                          }
                            ]
                })
            })
        })
    })
})