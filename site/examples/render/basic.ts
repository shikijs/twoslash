<p>// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
-readonly [Property in keyof Type]: Type[Property];
};</p>
<p>type LockedAccount = {
readonly id: string;
readonly name: string;
};</p>
<p>type UnlockedAccount = CreateMutable<LockedAccount>;</p>