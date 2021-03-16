
import icons from './icons';

export default [
    {
        name: 'general',
        title: 'عمومی',
        icon: icons.edit,
        active: true,
        enabled: true,
        items: [
            {
                name: 'bold',
                title: 'درشت',
                type: 'button',
                icon: icons.bold,
                active: false,
                options: {
                    type: 'text',
                    command: 'bold',
                },
            },
            {
                name: 'italic',
                title: 'کج',
                type: 'button',
                icon: icons.italic,
                active: false,
                options: {
                    type: 'text',
                    command: 'italic',
                },
            },
            {
                name: 'underline',
                title: 'زیر خط',
                type: 'button',
                icon: icons.underline,
                active: false,
                options: {
                    type: 'text',
                    command: 'underline',
                },
            },
            {
                name: 'strikethrough',
                title: 'خط خورده',
                type: 'button',
                icon: icons.strikethrough,
                active: false,
                options: {
                    type: 'text',
                    command: 'strikethrough',
                },
            },
            {
                type: 'separator'
            },
            {
                name: 'foreColor',
                title: 'رنگ متن',
                type: 'button',
                icon: icons.foreColor,
                active: false,
                options: {
                    type: 'color',
                    action: 'fore',
                },
            },
            {
                name: 'fillColor',
                title: 'رنگ زمینه',
                type: 'button',
                icon: icons.fillColor,
                active: false,
                options: {
                    type: 'color',
                    action: 'back',
                },
            },
            {
                type: 'separator'
            },
            {
                name: 'alignRight',
                title: 'راست چین',
                type: 'button',
                icon: icons.alignRight,
                active: false,
                options: {
                    type: 'text',
                    command: 'justifyRight',
                },
            },
            {
                name: 'alignCenter',
                title: 'وسط چین',
                type: 'button',
                icon: icons.alignCenter,
                active: false,
                options: {
                    type: 'text',
                    command: 'justifyCenter',
                },
            },
            {
                name: 'alignLeft',
                title: 'چپ چین',
                type: 'button',
                icon: icons.alignLeft,
                active: false,
                options: {
                    type: 'text',
                    command: 'justifyLeft',
                },
            },
        ]
    },
    {
        name: 'add',
        title: 'افزودن',
        icon: icons.add,
        active: false,
        enabled: true,
        items: [
            {
                name: 'image',
                title: 'عکس',
                type: 'button',
                icon: icons.image,
                active: false,
                options: {
                    type: 'image'
                },
            },
            {
                name: 'link',
                title: 'لینک',
                type: 'button',
                icon: icons.link,
                active: false,
                options: {
                    type: 'link'
                },
            },
            {
                name: 'emoji',
                title: 'ایموجی',
                type: 'button',
                icon: icons.emoji,
                active: false,
                options: {
                    type: 'emoji'
                },
            },
            // {
            //     name: 'time',
            //     title: 'تاریخ',
            //     type: 'button',
            //     icon: icons.calender,
            //     active: false,
            // },
            // {
            //     name: 'quote',
            //     title: 'نقل قول',
            //     type: 'button',
            //     icon: icons.quote,
            //     active: false,
            // },
            // {
            //     name: 'list',
            //     title: 'لیست',
            //     type: 'button',
            //     icon: icons.list,
            //     active: false,
            // },
            {
                name: 'math',
                title: 'عبارت ریاضی',
                type: 'button',
                icon: icons.math,
                active: false,
                options: {
                    type: 'math'
                },
            },
            {
                name: 'chart',
                title: 'چارت',
                type: 'button',
                icon: icons.chart,
                active: false,
                options: {
                    type: 'chart'
                },
            },
            // {
            //     name: 'table',
            //     title: 'جدول',
            //     type: 'button',
            //     icon: icons.table,
            //     active: false,
            // },
            {
                name: 'symbol',
                title: 'علامت',
                type: 'button',
                icon: icons.symbol,
                active: false,
                options: {
                    type: 'specialChars'
                },
            },
            // {
            //     name: 'code',
            //     title: 'کد',
            //     type: 'button',
            //     icon: icons.code,
            //     active: false,
            // },
        ]
    },
    // {
    //     type: 'spacer'
    // },
    {
        name: 'chart',
        title: 'نمودار',
        icon: icons.chart,
        active: false,
        enabled: false,
        items: [
            {
                name: 'item3',
                title: 'CONTENT-3',
                type: 'button',
                icon: icons.bold,
                active: false,
            }
        ]
    },
    {
        name: 'math',
        title: 'ریاضیات',
        icon: icons.math,
        active: false,
        enabled: false,
        items: [
            {
                name: 'fraction',
                title: 'کسر',
                type: 'button',
                icon: icons.toolFraction,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'fraction',
                    title: 'کسر',
                },
            },
            {
                name: 'radical',
                title: 'رادیکال',
                type: 'button',
                icon: icons.toolRadical,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'radical',
                    title: 'رادیکال',
                },
            },
            {
                name: 'integral',
                title: 'انتگرال',
                type: 'button',
                icon: icons.toolIntegral,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'integral',
                    title: 'انتگرال',
                },
            },
            {
                name: 'sigma',
                title: 'سیگما',
                type: 'button',
                icon: icons.toolSigma,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'sigma',
                    title: 'سیگما',
                },
            },
            {
                name: 'script',
                title: 'توان و اندیس',
                type: 'button',
                icon: icons.toolScript,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'script',
                    title: 'توان و اندیس',
                },
            },
            {
                name: 'limit',
                title: 'حد و لگاریتم',
                type: 'button',
                icon: icons.toolLimit,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'limit',
                    title: 'حد و لگاریتم',
                },
            },
            {
                name: 'operator',
                title: 'عملگر',
                type: 'button',
                icon: icons.toolOperator,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'operator',
                    title: 'عملگر',
                },
            },
            {
                name: 'function',
                title: 'تابع',
                type: 'button',
                icon: icons.toolFunction,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'functions',
                    title: 'تابع',
                },
            },
            {
                name: 'matrix',
                title: 'ماتریس',
                type: 'button',
                icon: icons.toolMatrix,
                active: false,
                options: {
                    type: 'matrix',
                },
            },
            {
                name: 'mathSymbol',
                title: 'علامت',
                type: 'button',
                icon: icons.toolSymbol,
                active: false,
                options: {
                    type: 'mathSymbol',
                },
            },
            {
                type: 'separator'
            },
            {
                name: 'bracket',
                title: 'براکت',
                type: 'button',
                icon: icons.toolBracket,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'container',
                    style: 'bracket',
                    title: 'براکت',
                },
            },
            {
                name: 'parenthesis',
                title: 'پرانتز',
                type: 'button',
                icon: icons.toolParenthesis,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'container',
                    style: 'parenthesis',
                    title: 'پرانتز',
                },
            },
            {
                name: 'absolute',
                title: 'قدر مطلق',
                type: 'button',
                icon: icons.toolAbsolute,
                active: false,
                options: {
                    type: 'equation',
                    equation: 'container',
                    style: 'absolute',
                    title: 'قدر مطلق',
                },
            },
        ]
    },
];