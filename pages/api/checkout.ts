import {NextApiRequest, NextApiResponse} from "next";
import {Stripe} from "stripe";

type Res = {
    session?: Stripe.Checkout.Session
    message?: string
}

type LineItem = {
    price: string
    quantity: number
}

type Req = {
    lineItems: LineItem[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Res>
) {
    if (req.method != 'POST') {
        res.status(405).json({message: 'POST method required'})
    }

    try {
        const body: Req = JSON.parse(req.body);

        const stripe = new Stripe(process.env.STRIPE_SECRET ?? '', {
            apiVersion: '2020-08-27',
        });

        const session = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            line_items: body.lineItems,
            mode: 'payment',
        });

        res.status(201).json({ session })
    }catch (e) {
        // @ts-ignore
        res.status(500).json({message: e.message})
    }

}
