import type {MetadataRoute} from 'next';
// Private review deployment: prevent indexing until the owner approves public launch.
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',disallow:'/'}};}
