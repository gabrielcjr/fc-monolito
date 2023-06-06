import UseCaseInterface from "../../../@shared/domain/usecase/usecase.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    constructor() {}

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        // buscar o cliente. Caso não encontre -> client not found
        // validar produto
        // recuperar os produtos

        // criar o objeto do client
        // criar o objeto da order (client, products)

        // processpayment ->paymentfacade.process (orderid, amount)

        // caso pagamento seja aprovado -> Gerar invoice
        // mudar o status da minha order para approved
        //returnar dto


        return {
            id: '',
            invoiceId: '',
            status: '',
            total: 0,
            products: [],
        }
    }
}