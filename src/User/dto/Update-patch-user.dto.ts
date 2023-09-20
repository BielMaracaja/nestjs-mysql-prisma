import { CreateUserDTO } from "./Create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {}