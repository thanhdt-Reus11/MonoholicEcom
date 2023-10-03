import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as paypal from '@paypal/checkout-server-sdk';
import { error } from 'console';
import { BillService } from 'src/bill/bill.service';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PaypalService {
    private readonly paypalClient : any;
    constructor(
        private billService : BillService,
        @InjectModel(Payment.name)
        private readonly paymentModel: Model<PaymentDocument>,
    ) {
        const clientID = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        const environment = new paypal.core.SandboxEnvironment(
            clientID,
            clientSecret,
          );
        this.paypalClient = new paypal.core.PayPalHttpClient(environment);
    }

    async createOrder(id: string) {
        const request = new paypal.orders.OrdersCreateRequest();

        const bill = await this.billService.findOne(id);
        if(!bill) {
            throw new BadRequestException('Bad Request!')
        }

        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                amount: {
                    currency_code: 'USD',
                    value: bill.payment_total.toFixed(2),
                    breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: bill.total.toFixed(2),
                        },
                        discount: {
                            currency_code: 'USD',
                            value: bill.discount.toFixed(2),
                          },
                      },
                },
                items:  bill.details.map(item => {
                    return {
                        name: item.product_id.title.toString(),
                        unit_amount: {
                            currency_code: "USD",
                            value: item.product_id.price,
                        },
                        quantity: item.quantity,
                    }
                }),
                custom_id: bill._id.toString(),
                },
            ],
        });

        try {
            // Gửi yêu cầu tới PayPal để tạo thanh toán
            const response = await this.paypalClient.execute(request);

            return response;
            // return {
            //     id: response.result.id,
            //     approvalUrl: response.result.links.find((link) => link.rel === 'approve').href,
            // }
        } catch (error) {
            // Xử lý lỗi
            console.error(error);
            throw new Error('Failed to create PayPal payment.');
        }
    }

    async capturePayment(id : string) {
        const captureRequest = new paypal.orders.OrdersCaptureRequest(id);
        try {
            const response = await this.paypalClient.execute(captureRequest);

            const total = parseFloat(response.result.purchase_units[0].payments.captures[0].amount.value);
            const bill_id = response.result.purchase_units[0].payments.captures[0].custom_id;

            const data = await this.create(bill_id, total);
            
            return response;
        } catch {
            console.log(error);
            throw new BadRequestException('Failed to create PayPal payment.');
        }
    }

    private async create (bill_id: string, total: number)  {  

        const id = new mongoose.Types.ObjectId(bill_id);
        try {
            const payment = this.paymentModel.create({
                bill_id: id,
                total: total
            });

            const bill = await this.billService.findOne(bill_id);

            const data = await this.paymentModel.find({bill_id: id});
            const paymentTotal = data.reduce((total, payment) => { return total = total + payment.total}, 0);
            
            if (paymentTotal >= bill.payment_total) {
                bill.fullfillment_status = 0;
            }

            bill.save();

            return bill;
        } catch (error) {
            console.log(error.details);
            throw new Error('Failed to create payment.')
        }
    }
}
