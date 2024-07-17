export default interface SignUpRequestDto {
    email: string;
    password: string;
    nickName: string;
    telNumber: string;
    address: string;
    addressDetail: string | null;
    agreedPersonal: boolean;
}