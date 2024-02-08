/// <reference types="vite/client" />
type PropsFor<T> = T extends React.ComponentType<infer P> ? P : never;
