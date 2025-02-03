export default function composeClasses<ClassKey extends string>(componentName: string, slots: {
    [key in ClassKey]: ReadonlyArray<string | false | undefined | null>;
}): {
    [key in ClassKey]: string;
};
