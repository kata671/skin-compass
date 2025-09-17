export type Product = { id:string; name:string; brand:string; type:"kosmetyk"|"dermokosmetyk"|"apteczny"; rating:number; price:string; tags:string[]; notes?:string; url?:string; image?:string };
export type ConditionKey = "tradzik"|"wagry"|"sucha_skora";

const CARD = import.meta.env.BASE_URL + 'assets/card-texture.jpg';

export const productsByCondition: Record<ConditionKey, Product[]> = {
  tradzik: [
    { id:"bx-acne-gel", name:"Acne Control Gel 2%", brand:"BX Labs", type:"dermokosmetyk", rating:4.7, price:"od 39 zł", tags:["BHA","żel","noc"], image: CARD },
    { id:"dr-azelaic", name:"Kwas azelainowy 10%", brand:"Dr. AZE", type:"kosmetyk", rating:4.6, price:"od 49 zł", tags:["azelainowy","przebarwienia"], image: CARD }
  ],
  wagry: [
    { id:"bha-tonic", name:"Tonik BHA 2%", brand:"ClearWave", type:"kosmetyk", rating:4.6, price:"od 35 zł", tags:["pory","strefa-T"], image: CARD }
  ],
  sucha_skora: [
    { id:"ceramide", name:"Krem z ceramidami", brand:"BarrierLab", type:"dermokosmetyk", rating:4.8, price:"od 39 zł", tags:["bariera"], image: CARD }
  ]
};
