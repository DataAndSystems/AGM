interface ResultT<T> {
    errno?: number,
    errmsg?: string,
    data?: T,
    code: number,
    message: string,
    success: boolean,
    total?: number,
}