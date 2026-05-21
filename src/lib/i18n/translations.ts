export const translations = {
  en: {
    terminal: {
      boot: [
        'INITIALIZING NEXUS PROTOCOL...',
        'LOADING ADAPTIVE INTERFACE...',
        'ESTABLISHING SECURE TUNNEL...',
        'DECRYPTING ENVIRONMENTAL DATA...',
        'READY FOR ACCESS.'
      ],
      title: 'Nexus Veil // Terminal Access',
      identifier: 'Identifier',
      passkey: 'Passkey',
      placeholder_id: 'ENTER ID',
      placeholder_pass: 'ENTER PASSKEY',
      authorize: 'Authorize Session',
      status: 'SYSTEM: ONLINE',
      version: 'VER: 0.1.0-ALPHA',
      monitoring: 'Environmental monitoring active'
    },
    nav: {
      weather: 'Digital Weather',
      weather_desc: 'Real-time atmospheric synchronization and environmental mood parameters. Monitoring planetary digital pulse and network instability.',
      cyber: 'Cybersecurity',
      github: 'Github Signals',
      osint: 'Osint Layer',
      disconnect: 'Disconnect'
    },
    common: {
      pulse: 'Pulse',
      alert: 'Alert',
      calm: 'Calm',
      tense: 'Tense',
      critical: 'Critical',
      loading: 'Loading...'
    },
    sections: {
      cyber: {
        title: 'Tactical Threat Space',
        subtitle: 'Layer 0 // Active Intrusion Detection',
        signal: 'SIGNAL STRENGTH',
        threat_level: 'THREAT LEVEL',
        anomaly: 'Anomaly Markers',
        instability: 'SYSTEM INSTABILITY DETECTED',
        terminal_title: 'Node 0x7F // Security Feed',
        packet: 'INBOUND PACKET FROM UNKNOWN CLUSTER'
      },
      osint: {
        title: 'Investigation // Deep Scan',
        subtitle: 'Global Node Distribution',
        satellite: 'SATELLITE DOWNLINK',
        active: 'ACTIVE',
        threshold: 'THRESHOLD',
        channel: 'Channel',
        link_stable: 'LINK_STABLE',
        resonance: 'Signal Resonance Hierarchy',
        relationship: 'Node Relationship Map',
        tracing: 'Tracing Signal...'
      },
      github: {
        title: 'Technical Ecosystem',
        subtitle: 'GITSIGNAL // GLOBAL_REPOSYNC_ACTIVE',
        objects: 'System Objects',
        load: 'Processing Load',
        threads: 'Active Threads',
        stream_title: 'Signal Stream',
        documentation: 'Access Documentation'
      }
    }
  },
  ru: {
    terminal: {
      boot: [
        'ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА NEXUS...',
        'ЗАГРУЗКА АДАПТИВНОГО ИНТЕРФЕЙСА...',
        'УСТАНОВКА ЗАЩИЩЕННОГО ТУННЕЛЯ...',
        'ДЕШИФРОВКА ЭКОЛОГИЧЕСКИХ ДАННЫХ...',
        'ГОТОВО К ДОСТУПУ.'
      ],
      title: 'Nexus Veil // Доступ к терминалу',
      identifier: 'Идентификатор',
      passkey: 'Ключ доступа',
      placeholder_id: 'ВВЕДИТЕ ID',
      placeholder_pass: 'ВВЕДИТЕ ПАРОЛЬ',
      authorize: 'Авторизовать сессию',
      status: 'СИСТЕМА: ОНЛАЙН',
      version: 'ВЕРСИЯ: 0.1.0-ALPHA',
      monitoring: 'Экологический мониторинг активен'
    },
    nav: {
      weather: 'Цифровая погода',
      weather_desc: 'Синхронизация атмосферы в реальном времени и параметры настроения среды. Мониторинг планетарного цифрового пульса и нестабильности сети.',
      cyber: 'Кибербезопасность',
      github: 'Сигналы GitHub',
      osint: 'Слой OSINT',
      disconnect: 'Отключиться'
    },
    common: {
      pulse: 'Пульс',
      alert: 'Тревога',
      calm: 'Спокойствие',
      tense: 'Напряжение',
      critical: 'Критично',
      loading: 'Загрузка...'
    },
    sections: {
      cyber: {
        title: 'Тактическое пространство угроз',
        subtitle: 'Уровень 0 // Активное обнаружение вторжений',
        signal: 'МОЩНОСТЬ СИГНАЛА',
        threat_level: 'УРОВЕНЬ УГРОЗЫ',
        anomaly: 'Маркеры аномалий',
        instability: 'ОБНАРУЖЕНА НЕСТАБИЛЬНОСТЬ СИСТЕМЫ',
        terminal_title: 'Узел 0x7F // Лента безопасности',
        packet: 'ВХОДЯЩИЙ ПАКЕТ ИЗ НЕИЗВЕСТНОГО КЛАСТЕРА'
      },
      osint: {
        title: 'Расследование // Глубокое сканирование',
        subtitle: 'Глобальное распределение узлов',
        satellite: 'СПУТНИКОВАЯ СВЯЗЬ',
        active: 'АКТИВНА',
        threshold: 'ПОРОГ',
        channel: 'Канал',
        link_stable: 'СВЯЗЬ_СТАБИЛЬНА',
        resonance: 'Иерархия резонанса сигналов',
        relationship: 'Карта взаимосвязей узлов',
        tracing: 'Трассировка сигнала...'
      },
      github: {
        title: 'Техническая экосистема',
        subtitle: 'GITSIGNAL // ГЛОБАЛЬНАЯ_СИНХРОНИЗАЦИЯ_РЕПОЗИТОРИЕВ',
        objects: 'Системные объекты',
        load: 'Нагрузка обработки',
        threads: 'Активные потоки',
        stream_title: 'Поток сигналов',
        documentation: 'Документация'
      }
    }
  }
};

export type Language = 'en' | 'ru';
export type TranslationKey = typeof translations.en;
