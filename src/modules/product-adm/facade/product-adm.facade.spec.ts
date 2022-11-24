import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../use-case/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";

describe("ProductAdmFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })

    it("should create a product", async () => {
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        }

        await productFacade.addProduct(input)

        const productDb = await ProductModel.findOne(
            { where: { id: input.id } }
        )

        expect(input.id).toEqual(productDb.id)
        expect(input.name).toEqual(productDb.name)
        expect(input.description).toEqual(productDb.description)
        expect(input.purchasePrice).toEqual(productDb.purchasePrice)
        expect(input.stock).toEqual(productDb.stock)

    })

})