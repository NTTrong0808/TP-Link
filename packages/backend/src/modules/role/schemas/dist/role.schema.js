"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RoleSchema = exports.Role = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var role_enum_1 = require("../role.enum");
var Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        mongoose_1.Prop({ required: true })
    ], Role.prototype, "name");
    __decorate([
        mongoose_1.Prop()
    ], Role.prototype, "description");
    __decorate([
        mongoose_1.Prop({ required: true })
    ], Role.prototype, "roleCode");
    __decorate([
        mongoose_1.Prop({ type: [String], "default": [] })
    ], Role.prototype, "permissionKeys");
    __decorate([
        mongoose_1.Prop({ "default": 0 })
    ], Role.prototype, "totalUsers");
    __decorate([
        mongoose_1.Prop({ "default": true })
    ], Role.prototype, "isActive");
    __decorate([
        mongoose_1.Prop({ "default": false })
    ], Role.prototype, "isDeleted");
    __decorate([
        mongoose_1.Prop({ required: false, "default": role_enum_1.RoleProvider.Ticket, "enum": Object.values(role_enum_1.RoleProvider) })
    ], Role.prototype, "provider");
    Role = __decorate([
        mongoose_1.Schema({
            timestamps: true
        })
    ], Role);
    return Role;
}(mongoose_2.Document));
exports.Role = Role;
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);
