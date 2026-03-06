/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'amadeus' {
    interface AmadeusOptions {
        clientId: string;
        clientSecret: string;
        hostname?: string;
        logger?: Console;
    }

    interface Response {
        data: any[];
        result: any;
        body: string;
        statusCode: number;
    }

    class Amadeus {
        constructor(options: AmadeusOptions);

        referenceData: {
            locations: {
                get(params: Record<string, unknown>): Promise<Response>;
                hotels: {
                    byCity: {
                        get(params: Record<string, unknown>): Promise<Response>;
                    };
                };
            };
        };

        shopping: {
            flightOffersSearch: {
                get(params: Record<string, unknown>): Promise<Response>;
            };
            hotelOffersSearch: {
                get(params: Record<string, unknown>): Promise<Response>;
            };
        };
    }

    export default Amadeus;
}
