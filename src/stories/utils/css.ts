// import styled from '@emotion/styled';

// export const css = <TParams extends any[]>(strParts: TemplateStringsArray, ...params: TParams) => {
//     return <TComp extends React.ComponentType<any>>(component: TComp, displayName?: string) => {
//         const comp = styled<TComp>(component)(strParts, ...params);
//         comp.displayName = `css(${
//             displayName ||
//             component.displayName ||
//             comp.displayName ||
//             component.constructor.name ||
//             comp.constructor.name ||
//             'Anonymous'
//         })`;
//         return comp;
//     };
// };
