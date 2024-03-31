import RPToolboxPlugin from "main"
import { App, PluginSettingTab, Setting } from "obsidian"
import settingsStore from "./settingsStore";
import OpenAI from "openai";

export class SettingsTab extends PluginSettingTab {
  plugin: RPToolboxPlugin;

  constructor(app: App, plugin: RPToolboxPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Create an API key at https://platform.openai.com/account/api-keys. This is required to automatically generate content in the plugin. Otherwise, you will need to manually copy paste stuff to your language model.")
      .addText((text) =>
        text
          .setPlaceholder("Write your API key here...")
          .setValue(this.plugin.settings.openaiApiKey)
          .onChange(async (value) => {
            if (typeof value !== "string" || value.length === 0) {
                return
            }

            this.plugin.settings.openaiApiKey = value;
            settingsStore.update((store) => ({ ...store, openAiClient: new OpenAI({
                apiKey: value,
                dangerouslyAllowBrowser: true
            }) }));
            
            await this.plugin.saveSettings();
          })
      );
  }
}