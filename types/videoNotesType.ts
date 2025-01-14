export type flashcardsType= { 
    id: { type: Number, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true }
  }[]