export default class ResultWrapper<Type> {
    status!: number;
    data!: Type;
    message = '';
    isOK = false;
}
