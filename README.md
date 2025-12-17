# SalesWhisper Landing Pages

[![Static Site](https://img.shields.io/badge/Type-Static_HTML-green.svg)]()

Статические лендинговые страницы для SalesWhisper продуктов.

## Структура

```
/
├── index.html      # Главная страница SalesWhisper
├── assets/
│   ├── css/        # Стили
│   ├── js/         # Скрипты
│   └── images/     # Изображения
├── robots.txt      # Для SEO
└── sitemap.xml     # Карта сайта
```

## Деплой

Файлы раздаются напрямую через Nginx:

```nginx
server {
    listen 80;
    server_name saleswhisper.pro www.saleswhisper.pro;
    root /var/www/sites.saleswhisper.pro;
    index index.html;
}
```

## Продукты

SalesWhisper включает:
- **Crosspost** - Кроссплатформенная публикация контента
- **Head of Sales** - AI-анализ звонков для руководителей
- **SoVAni AI Seller** - Автоматизация продаж

## Связанные репозитории

- [crosspost-frontend](https://github.com/zydzymax/crosspost-frontend)
- [headofsales-frontend](https://github.com/zydzymax/headofsales-frontend)
- [salesbot-mvp](https://github.com/zydzymax/salesbot-mvp)
