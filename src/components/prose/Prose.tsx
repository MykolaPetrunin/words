import { FC, PropsWithChildren, useMemo } from 'react';
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
    codeClassName?: string;
}

export const Prose: FC<PropsWithChildren<ProseProps>> = ({ children, isMD = false, colorStyles, className, codeClassName }) => {
    const paletteClasses = useMemo(
        () =>
            cn(
                'prose prose-sm max-w-none text-foreground dark:text-foreground prose-headings:text-foreground dark:prose-headings:text-foreground prose-p:text-foreground dark:prose-p:text-foreground prose-li:text-foreground dark:prose-li:text-foreground prose-strong:text-foreground dark:prose-strong:text-foreground prose-code:text-foreground dark:prose-code:text-foreground prose-code:bg-muted/40 dark:prose-code:bg-muted/20 prose-pre:bg-muted/40 dark:prose-pre:bg-muted/20 prose-a:text-primary dark:prose-a:text-primary',
                colorStyles ? colorStyles : 'prose-zinc dark:prose-invert',
                className
            ),
        [className, colorStyles]
    );

    return (
        <article className={paletteClasses}>
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
                                    <code className={cn(className, colorStyles ?? codeClassName ?? 'text-foreground dark:text-foreground')} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            ) : (
                                <code className={cn(codeClassName ?? colorStyles ?? 'text-foreground dark:text-foreground', 'px-1 py-0.5 rounded text-sm')} {...props}>
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
