# MONJA OUTLOOK SEND GUARD

[日本語](#japanese) | [English](#english) | [简体中文](#simplified-chinese)

<a id="japanese"></a>

# もんじゃOutlook誤送信防止 / MONJA OUTLOOK SEND GUARD



**送信する前に、もう一度、確認を。**

Microsoft 365 OutlookのWeb版・対応するPC版で、送信前の確認を支援する無料のOffice Web Add-inです。宛先・件名・添付忘れなどを確認し、メールの誤送信リスクを減らします。発行者：ファーストサクセス合同会社（First Success G.K.）。

- [製品サイト・説明書・FAQ](https://outlook-send-guard.mnoda1979.chatgpt.site/)
- [お問い合わせ](https://first-success.com)

## 主な機能

| 機能 | 内容 |
|---|---|
| 社外宛先 | 登録した社内ドメインとの完全一致で判定 |
| To / Cc / Bcc | 各欄の解決済み宛先を確認。配布リストのメンバーは展開しません |
| 宛先重複 | 大文字・小文字を区別せず同じメールアドレスを検出。別名は統合しません |
| 類似ドメイン | 社内ドメインに似た社外ドメインを検出。判定は正当性を保証しません |
| 添付忘れ | 日本語・英語・中国語の添付表現と通常添付の有無から警告 |
| 件名・To空欄 | 空の件名を確認。To空欄の警告は初期OFF |
| 添付名の確認 | 手動確認で非インライン添付の名前を表示。添付内容は解析しません |
| 個人設定 | 最大100件の社内ドメイン、警告、表示言語をRoamingSettingsに保存 |

通常の警告は初期ONです。社内ドメイン未設定や検証失敗も通知します。サブドメインは個別に登録し、国際化ドメインはASCII/Punycode表記を使用してください。アカウントのドメイン候補を自動登録することはありません。

## 導入方法は2種類

| 版 | XML | チェック方法 |
|---|---|---|
| 管理者配布版 | `manifest-admin.xml` | 対応環境で送信時の自動チェック＋手動確認 |
| 利用者導入版 | `manifest-user.xml` | 手動確認のみ。送信前に毎回「この下書きを確認」を押す |

管理者はMicrosoft 365管理センターの「設定 → 統合アプリ」でXMLをアップロードし、まずテストユーザーに割り当てます。表示まで24～48時間程度かかる場合があります。利用者による追加は、組織が許可している場合に[Outlookのアドイン管理画面](https://aka.ms/olksideload)から「個人用アドイン → カスタムアドインの追加 → ファイルから追加」で行います。メニュー表示は環境により異なります。

両版は同じアドインIDを使用します。同一メールボックスに同時導入せず、切替時は管理者と確認し、既存の割当や個人追加を解除してください。一般利用者にNode.jsやローカルサーバーは不要です。現在の配布方針はSitesで、Marketplace配布ではありません。

## 初期設定と使い方

1. メール作成画面でMonja Send Guardを開き、社内ドメインを確認して追加します。
2. 警告と表示言語を選び、「設定を保存」の完了を確認します。保存後は下書きを開き直してください。
3. 手動確認では「この下書きを確認」を押し、宛先・件名・添付名と警告を確認します。結果は設定パネル内のポップアップに表示され、「閉じる」またはEscで閉じられます。
4. 修正した場合は再確認し、Outlookの送信ボタンで送信します。管理者版では対応環境で送信時にもチェックし、Outlook標準の確認・警告画面を表示します。

手動確認は現在のフォームとクリック時点の下書きを使い、自動チェックは保存済み設定を使います。手動確認後にメールや設定を変更すると結果は古くなります。利用者版は送信ボタンで自動チェックや送信停止を行いません。ピン留めでパネルを維持しても、毎回の手動確認が必要です。設定同期は即時とは限らず、更新や再起動が必要な場合があります。

## 対応環境と制限

主な対象はExchange Onlineの法人Microsoft 365アカウントと、対応するOutlook Web、New Outlook for Windows、Classic Outlook for Windows、Outlook for Macです。サイト記載の要件はMailbox API 1.12。詳細は技術調査 (`docs/RESEARCH.md`)と導入仕様 (`docs/DISTRIBUTION.md`)を参照してください。モバイル、旧Outlook、POP/IMAP、個人Microsoftアカウントはサポート対象外です。

すべての誤送信を防止する製品ではありません。配布リスト展開、完全な別名解決、添付内容解析には対応しません。1フィールド500件以上の宛先では完全な確認を保証せず、未検証警告を表示します。取得失敗・設定破損・期限超過も未検証として通知します。非対応環境や読込失敗ではチェックなしで送信できる場合があるため、最後は利用者自身で確認してください。

## プライバシー・利用条件・サポート

メールの宛先・件名・本文・添付名などはアドインの実行環境内で確認し、開発者サーバーへ送信したり添付ファイルをアップロードしたりしません。メール検証に外部AI、Graph、OAuth、独自データベース、アクセス解析は使用しません。Azureアプリ登録やライセンス認証も不要です。Office.jsや静的ファイルの取得には通信が発生し、配信事業者にアクセスログが残る場合があります。

ドメイン・警告・言語などの設定はMicrosoftのRoamingSettingsに保存します。サイトの言語選択はブラウザのlocalStorageに保存します。無料で利用できますが、Microsoft 365等の契約費用は別です。組織ポリシーと適用法令に従い、利用者自身で最終確認してください。

詳しい[プライバシー](https://outlook-send-guard.mnoda1979.chatgpt.site/#privacy)、[利用条件](https://outlook-send-guard.mnoda1979.chatgpt.site/#terms)、[サポート](https://outlook-send-guard.mnoda1979.chatgpt.site/#support)は製品サイトの同一ページにあります。不具合報告にはOutlookの種類・バージョンと警告項目を添え、メール本文・宛先・添付などの機密情報は送らないでください。

## 検証状況

サイトは公開済みです。Web版の修正後に「動作した」との利用者報告がありますが、クライアントのビルド番号や詳細なテストケースは提供されていません。Codexが実機テストを実施した証拠ではなく、全環境・全機能の検証完了を意味しません。ホスティングには未確認事項が残ります。2026-10-21のリリース向け表示の承認も、実機テストの証拠とは別です。最新の実施内容・未確認事項はSTATUS (`docs/STATUS.md`)、承認の記録はRELEASE-DECISION (`docs/RELEASE-DECISION.md`)を参照してください。

## 開発

```powershell
cd C:\outlook-send-guard
npm ci
npm run check
npm run validate:manifest
```

| 場所 | 内容 |
|---|---|
| `src/settings` / `src/validation` | 設定スキーマとメール判定 |
| `src/services` / `src/commands` | Office.js、設定保存、送信イベント |
| `src/ui` / `src/locales` | 設定画面と3言語 |
| `site/content` | サイトの3言語原稿（本READMEの説明元） |
| `public` / `assets` | 静的ページ、CSS、アイコン |
| `scripts` / `tests` | ビルド、マニフェスト生成、検証 |
| `dist` | ビルドで生成する静的成果物 |

`config.json`でURL・GUID・バージョンを管理します。`addinId`は固定のOfficeアドインGUIDで、EntraアプリIDではありません。実行バンドルの外部依存はOffice.jsのみです。開発の詳細はローカルテスト (`docs/LOCAL-TEST.md`)、ホスティング (`docs/HOSTING.md`)、構成ファイル (`docs/FILES.md`)を参照してください。

---

<a id="english"></a>

# MONJA OUTLOOK SEND GUARD



**Before you send, take another look.**

A free Office Web Add-in for pre-send review in Microsoft 365 Outlook on the web and supported desktop clients. It checks recipients, subject and possible missing attachments to reduce the risk of misdirected email. Publisher: First Success G.K.（ファーストサクセス合同会社）.

- [Product website, manual and FAQ](https://outlook-send-guard.mnoda1979.chatgpt.site/)
- [Contact](https://first-success.com)

## Features

| Feature | Behavior |
|---|---|
| External recipients | Compares recipient domains with registered internal domains using exact matches |
| To / Cc / Bcc | Checks resolved addresses in all fields; does not expand distribution lists |
| Duplicate recipients | Detects identical addresses without case sensitivity; does not consolidate aliases |
| Similar domains | Flags external domains resembling internal domains; findings do not prove an error |
| Missing attachments | Uses Japanese, English and Chinese attachment expressions and the presence of non-inline attachments |
| Empty subject / To | Checks blank subjects; empty-To warning defaults to OFF |
| Attachment names | Manual review lists non-inline attachment names; no attachment content analysis |
| Personal settings | Stores up to 100 internal domains, warnings and display language in RoamingSettings |

Other configurable warnings default to ON. Missing domain configuration and failed checks are also reported. Register subdomains separately and use ASCII/Punycode for internationalized domains. Account domain suggestions are never registered automatically.

## Two installation options

| Edition | XML | Review mode |
|---|---|---|
| Administrator | `manifest-admin.xml` | Automatic send checks in supported environments, plus manual review |
| Individual | `manifest-user.xml` | Manual only; select Review this draft before every send |

Administrators upload the XML through Microsoft 365 admin center → Settings → Integrated apps and assign test users first. It may take approximately 24–48 hours to appear. Where organization policy permits, individuals use the [Outlook add-in management page](https://aka.ms/olksideload): My add-ins → Add a custom add-in → Add from File. Labels may vary by environment.

Both editions use the same add-in ID. Do not install both in one mailbox concurrently. Coordinate with the administrator and remove the previous assignment or personal installation before switching. End users need no Node.js or local server. The current distribution plan uses Sites, rather than Marketplace distribution.

## Setup and use

1. While composing a message, open Monja Send Guard and confirm and add your internal domains.
2. Choose warnings and language, select Save settings and wait for confirmation. Reopen the draft after saving.
3. Select Review this draft to inspect recipients, subject, attachment names and warnings. Results appear in a popup inside the settings pane; use Close or Escape to dismiss it.
4. After corrections, review again and send using Outlook. In supported environments, the administrator edition also checks on send and displays Outlook’s standard confirmation or warning dialog.

Manual review uses the current form and the draft at the time of the click; automatic checks use saved settings. Editing the message or settings makes manual results stale. The individual edition neither checks automatically nor blocks sending when you select Send. Pinning the pane does not remove the need for manual review before every send. Settings synchronization may require a refresh or restart.

## Compatibility and limitations

The primary target is corporate Microsoft 365 accounts on Exchange Online with supported Outlook on the web, new Outlook for Windows, classic Outlook for Windows or Outlook for Mac. The website specifies Mailbox API 1.12. See technical research (`docs/RESEARCH.md`) and distribution details (`docs/DISTRIBUTION.md`). Mobile, older Outlook, POP/IMAP and personal Microsoft accounts are outside the support scope.

The product cannot prevent every misdirected message. It does not expand distribution lists, fully resolve aliases or analyze attachment contents. At 500 or more recipients in any field, it reports an incomplete check rather than guaranteeing full coverage. Read failures, invalid settings and deadlines also produce incomplete-check warnings. Unsupported environments and load failures may allow unchecked sending. Always make your own final review.

## Privacy, terms and support

Recipients, subject, body and attachment information are checked within the add-in runtime. The add-in does not send mail data to developer servers or upload attachments. Mail validation uses no external AI, Graph, OAuth, custom database or analytics. No Azure app registration or license activation is needed. Loading Office.js and static files requires network requests; hosting providers may retain access logs.

Domains, warnings and language settings are stored in Microsoft RoamingSettings. The website stores its language choice in browser localStorage. The add-in is free; Microsoft 365 subscription costs are separate. Follow organization policies and applicable law, and make your own final review.

[Privacy](https://outlook-send-guard.mnoda1979.chatgpt.site/#privacy), [terms](https://outlook-send-guard.mnoda1979.chatgpt.site/#terms) and [support](https://outlook-send-guard.mnoda1979.chatgpt.site/#support) are on the same product page. For issue reports, provide Outlook type, version and warning category. Do not send message bodies, recipient addresses, attachments or confidential information.

## Verification status

The website is published. A user reported that Outlook on the web worked after a fix, but supplied no client build or detailed test cases. This is user-reported evidence, not a device test performed by Codex or proof of complete coverage across clients and features. Hosting verification still has open items. Release-presentation authorization dated 2026-10-21 is also separate from device-test evidence. See STATUS (`docs/STATUS.md`) for actual checks and open items, and RELEASE-DECISION (`docs/RELEASE-DECISION.md`) for authorization.

## Development

```powershell
cd C:\outlook-send-guard
npm ci
npm run check
npm run validate:manifest
```

| Location | Purpose |
|---|---|
| `src/settings` / `src/validation` | Settings schema and message validation |
| `src/services` / `src/commands` | Office.js, settings storage and send events |
| `src/ui` / `src/locales` | Settings UI and three languages |
| `site/content` | Three-language website copy used as the basis for this README |
| `public` / `assets` | Static pages, CSS and icons |
| `scripts` / `tests` | Builds, manifest generation and checks |
| `dist` | Generated static build output |

`config.json` manages URLs, GUID and version. Keep `addinId` fixed: it is an Office add-in GUID, not an Entra application ID. Runtime bundles have no third-party dependencies beyond Office.js. See local testing (`docs/LOCAL-TEST.md`), hosting (`docs/HOSTING.md`) and file inventory (`docs/FILES.md`).

---

<a id="simplified-chinese"></a>

# Monja Outlook 邮件误发送防护 / MONJA OUTLOOK SEND GUARD



**发送之前，再确认一次。**

面向Microsoft 365 Outlook网页版及受支持桌面客户端的免费Office Web Add-in。通过检查收件人、主题和可能遗漏的附件，帮助降低邮件误发送风险。发行者：First Success G.K.（ファーストサクセス合同会社）。

- [产品网站、使用说明与常见问题](https://outlook-send-guard.mnoda1979.chatgpt.site/)
- [联系窗口](https://first-success.com)

## 主要功能

| 功能 | 说明 |
|---|---|
| 外部收件人 | 与已注册内部域名进行完全匹配 |
| 收件人 / 抄送 / 密送 | 检查各字段中已解析的地址，不展开通讯组成员 |
| 重复收件人 | 忽略大小写检测相同地址，不合并别名 |
| 相似域名 | 提示与内部域名相似的外部域名，不保证该地址一定有误 |
| 遗漏附件 | 根据日语、英语、中文的附件表达及是否存在非内嵌附件进行提示 |
| 空主题 / 空收件人 | 检查空主题；空收件人警告默认关闭 |
| 附件名称 | 手动检查显示非内嵌附件名称，不分析附件内容 |
| 个人设置 | 将最多100个内部域名、警告和显示语言保存到RoamingSettings |

其他可配置警告默认开启。内部域名未设置或检查失败也会提示。子域名需单独注册，国际化域名请使用ASCII/Punycode格式。账户域名建议不会自动注册。

## 两种安装方式

| 版本 | XML | 检查方式 |
|---|---|---|
| 管理员部署版 | `manifest-admin.xml` | 在受支持环境中发送时自动检查，也可手动检查 |
| 用户安装版 | `manifest-user.xml` | 仅手动检查；每次发送前点击“检查此草稿” |

管理员在Microsoft 365管理中心的“设置 → 集成应用”上传XML，先分配给测试用户。加载项可能需要约24～48小时才会显示。组织策略允许时，用户可通过[Outlook加载项管理页面](https://aka.ms/olksideload)，选择“我的加载项 → 添加自定义加载项 → 从文件添加”。菜单名称可能因环境而异。

两版使用相同的加载项ID，不可在同一邮箱中同时安装。切换前请与管理员确认，移除旧分配或个人安装。普通用户无需Node.js或本地服务器。当前通过Sites提供安装说明，不采用Marketplace分发。

## 初始设置与使用

1. 撰写邮件时打开Monja Send Guard，确认并添加内部域名。
2. 选择警告与语言，点击“保存设置”并确认保存成功。保存后重新打开草稿。
3. 点击“检查此草稿”，查看收件人、主题、附件名称和警告。结果显示在设置窗格内的弹窗中，可点击“关闭”或按Esc关闭。
4. 修改后重新检查，再通过Outlook发送。管理员版在受支持环境中也会在发送时检查，并显示Outlook标准确认或警告窗口。

手动检查使用当前设置表单及点击时的草稿；自动检查使用已保存设置。修改邮件或设置后，手动结果会过时。用户版在点击发送时不会自动检查或阻止发送。固定窗格后仍需每次手动检查。设置同步可能需要刷新或重启，不保证即时完成。

## 支持环境与限制

主要面向Exchange Online上的企业Microsoft 365账户，以及受支持的Outlook网页版、New Outlook for Windows、Classic Outlook for Windows和Outlook for Mac。网站标明需要Mailbox API 1.12。详情见技术调查 (`docs/RESEARCH.md`)与部署说明 (`docs/DISTRIBUTION.md`)。移动端、旧版Outlook、POP/IMAP和个人Microsoft账户不在支持范围内。

本产品无法防止所有误发送。不展开通讯组、不完整解析所有别名，也不分析附件内容。任一字段达到500个收件人时，会提示检查未完成，不保证覆盖全部地址。读取失败、设置损坏或超时也会提示检查未完成。不支持的环境或加载失败可能允许未经检查发送，用户必须自行最终确认。

## 隐私、使用条款与支持

收件人、主题、正文和附件信息仅在加载项运行环境内检查，不发送到开发者服务器，也不上传附件。邮件检查不使用外部AI、Graph、OAuth、自建数据库或分析追踪。无需Azure应用注册或许可证激活。加载Office.js和静态文件会产生网络请求，托管服务商可能保留访问日志。

域名、警告与语言设置保存在Microsoft RoamingSettings。网站语言选择保存在浏览器localStorage。加载项免费，Microsoft 365等订阅费用另计。请遵守组织策略及适用法律，自行进行最终确认。

[隐私政策](https://outlook-send-guard.mnoda1979.chatgpt.site/#privacy)、[使用条款](https://outlook-send-guard.mnoda1979.chatgpt.site/#terms)与[支持](https://outlook-send-guard.mnoda1979.chatgpt.site/#support)位于产品网站的同一页面。报告问题时请提供Outlook类型、版本和警告项目，不要发送正文、收件人地址、附件或机密信息。

## 验证状态

网站已发布。修复后有用户反馈Outlook网页版可以正常运行，但未提供客户端构建号或详细测试用例。这属于用户反馈，不代表Codex执行过实机测试，也不证明所有客户端及功能已全部验证。托管验证仍有未确认事项。2026-10-21的发布展示授权也与实机测试证据分开记录。实际检查及待确认事项见STATUS (`docs/STATUS.md`)，授权记录见RELEASE-DECISION (`docs/RELEASE-DECISION.md`)。

## 开发

```powershell
cd C:\outlook-send-guard
npm ci
npm run check
npm run validate:manifest
```

| 位置 | 内容 |
|---|---|
| `src/settings` / `src/validation` | 设置架构与邮件检查 |
| `src/services` / `src/commands` | Office.js、设置保存与发送事件 |
| `src/ui` / `src/locales` | 设置界面与三种语言 |
| `site/content` | 三语网站文案，本README的说明依据 |
| `public` / `assets` | 静态页面、CSS与图标 |
| `scripts` / `tests` | 构建、清单生成与检查 |
| `dist` | 构建生成的静态文件 |

`config.json`管理URL、GUID与版本。`addinId`必须保持固定，它是Office加载项GUID，不是Entra应用ID。运行包除Office.js外无第三方依赖。另见本地测试 (`docs/LOCAL-TEST.md`)、托管说明 (`docs/HOSTING.md`)与文件清单 (`docs/FILES.md`)。
