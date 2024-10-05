export interface IUserProps {
  _id:string;
  name: string;
  email: string;
  password: string;
  image: string ;
  role?:string;
}

export class User {
  public _id:string;
  public name: string;
  public email: string;
  public password: string;
  public image: string;
  public role:string;

  constructor(props:Partial<IUserProps>) {
    this._id=props._id||"";
    this.name = props.name!;
    this.email = props.email!;
    this.password = props.password!;
    this.image = props.image!;
    this.role=props.role!
  }
}
