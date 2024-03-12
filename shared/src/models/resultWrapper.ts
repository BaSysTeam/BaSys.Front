export default class ResultWrapper<Type> {
    status!: number;
    data!: Type;
    message = '';
    presentation = '';
    isOK = false;
}
