import { FC, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

interface ProseProps {
    isMD?: boolean;
    colorStyles?: string;
    className?: string;
}

export const Prose: FC<PropsWithChildren<ProseProps>> = ({ children, isMD = false, colorStyles, className }) => {
    return (
        <article className={cn('prose max-w-none', colorStyles ? colorStyles : 'prose-zinc dark:prose-invert', className)}>
            {isMD ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSanitize]}
                    components={{
                        code: ({ className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return !isInline ? (
                                <pre className="p-4 rounded-lg overflow-x-auto">
                                    <code className={cn(className, colorStyles)} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            ) : (
                                <code className={cn(colorStyles, 'px-1 py-0.5 rounded text-sm')} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {children as string}
                </ReactMarkdown>
            ) : (
                children
            )}
        </article>
    );
};
