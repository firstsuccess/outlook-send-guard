export function manifest(c,base,distribution='admin'){
 if(!['admin','user'].includes(distribution))throw Error('Unknown distribution');
 const managed=distribution==='admin',pane=managed?'taskpane.html':'taskpane-user.html';
 const site=c.websiteUrl; const local=(tag,en,ja,zh)=>`<${tag} DefaultValue="${en}"><Override Locale="ja-JP" Value="${ja}"/><Override Locale="zh-CN" Value="${zh}"/></${tag}>`;
 return `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0" xsi:type="MailApp">
<Id>${c.addinId}</Id><Version>${c.version}.0</Version><ProviderName>First Success G.K.</ProviderName><DefaultLocale>en-US</DefaultLocale>
${local('DisplayName','Monja Send Guard','Monja Send Guard','Monja Send Guard')}
${local('Description',managed?'Administrator deployment: automatic and manual review.':'Individual installation: manual review only.',managed?'管理者配布版：送信時自動チェックと手動確認。':'利用者導入版：手動確認専用。',managed?'管理员部署版：自动与手动检查。':'用户安装版：仅手动检查。')}
<IconUrl DefaultValue="${base}/assets/icon-64.png"/><HighResolutionIconUrl DefaultValue="${base}/assets/icon-128.png"/><SupportUrl DefaultValue="${site}"/>
<AppDomains><AppDomain>${new URL(base).origin}</AppDomain></AppDomains><Hosts><Host Name="Mailbox"/></Hosts><Requirements><Sets><Set Name="Mailbox" MinVersion="1.12"/></Sets></Requirements>
<FormSettings><Form xsi:type="ItemEdit"><DesktopSettings><SourceLocation DefaultValue="${base}/${pane}"/></DesktopSettings></Form></FormSettings>
<Permissions>ReadItem</Permissions><Rule xsi:type="ItemIs" ItemType="Message" FormType="Edit"/><DisableEntityHighlighting>false</DisableEntityHighlighting>
<VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides" xsi:type="VersionOverridesV1_0">
<VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides/1.1" xsi:type="VersionOverridesV1_1">
<Requirements><bt:Sets DefaultMinVersion="1.12"><bt:Set Name="Mailbox"/></bt:Sets></Requirements>
<Hosts><Host xsi:type="MailHost">${managed?'<Runtimes><Runtime resid="Runtime.Url"><Override type="javascript" resid="Script.Url"/></Runtime></Runtimes>':''}<DesktopFormFactor><FunctionFile resid="Runtime.Url"/>
<ExtensionPoint xsi:type="MessageComposeCommandSurface"><OfficeTab id="TabDefault"><Group id="Monja.Group"><Label resid="Group.Label"/><Control xsi:type="Button" id="Monja.Settings"><Label resid="Settings.Label"/><Supertip><Title resid="Settings.Label"/><Description resid="Settings.Description"/></Supertip><Icon><bt:Image size="16" resid="Icon.16"/><bt:Image size="32" resid="Icon.32"/><bt:Image size="80" resid="Icon.80"/></Icon><Action xsi:type="ShowTaskpane"><SourceLocation resid="Taskpane.Url"/><SupportsPinning>true</SupportsPinning></Action></Control></Group></OfficeTab></ExtensionPoint>
${managed?'<ExtensionPoint xsi:type="LaunchEvent"><LaunchEvents><LaunchEvent Type="OnMessageSend" FunctionName="onMessageSend" SendMode="PromptUser"/></LaunchEvents><SourceLocation resid="Runtime.Url"/></ExtensionPoint>':''}
</DesktopFormFactor></Host></Hosts>
<Resources><bt:Images>${[16,32,80].map(n=>`<bt:Image id="Icon.${n}" DefaultValue="${base}/assets/icon-${n}.png"/>`).join('')}</bt:Images>
<bt:Urls><bt:Url id="Runtime.Url" DefaultValue="${base}/${managed?'commands.html':'commands-user.html'}"/>${managed?`<bt:Url id="Script.Url" DefaultValue="${base}/launchevent.js"/>`:''}<bt:Url id="Taskpane.Url" DefaultValue="${base}/${pane}"/></bt:Urls>
<bt:ShortStrings><bt:String id="Group.Label" DefaultValue="Monja Send Guard"/><bt:String id="Settings.Label" DefaultValue="Monja Send Guard"><bt:Override Locale="ja-JP" Value="Monja Send Guard"/><bt:Override Locale="zh-CN" Value="Monja Send Guard"/></bt:String></bt:ShortStrings>
<bt:LongStrings><bt:String id="Settings.Description" DefaultValue="Configure send warnings and review attachment names."><bt:Override Locale="ja-JP" Value="送信前の警告を設定し、添付ファイル名を確認します。"/><bt:Override Locale="zh-CN" Value="配置发送警告并查看附件名称。"/></bt:String></bt:LongStrings></Resources>
</VersionOverrides></VersionOverrides></OfficeApp>`;
}
