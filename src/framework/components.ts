import { h } from "../jsx-runtime";
import { VNode } from "./types";

export const Link = ({ href, children, ...props }: { href: string, children?: VNode }) => h('a', { href, ...props }, children || '')