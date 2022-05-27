import std.stdio;
import std.file;
import std.path;
import std.regex;
import std.array;
import std.string;
import std.algorithm;

void main(string[] args) {
	if (args.length < 2) {
		writeln("usage: compile index.html.template");
		return;
	}

	auto srcFile = args[1];
	if (!srcFile.exists || !srcFile.isFile) {
		writeln("Error: ", srcFile, " does not exit");
	}

	auto outFile = srcFile.stripExtension;

	auto transDir = "languages";
	if (!transDir.exists || !transDir.isDir) {
		writeln("Error: ", transDir, " does not exit");
	}

	auto src = srcFile.readText;

	string[string][string] dictionaries;

	foreach (tr; dirEntries(transDir, "*.tr", SpanMode.shallow)) {
		try {
			auto lang = tr.name.baseName.stripExtension;

			string[string] dictionary;
			auto pattern = regex(`msgid (.*)\r\nmsgstr (.*)\r\n`); 
			foreach (match; tr.readText.matchAll(pattern)) {
				auto msgid = match[1].strip;
				auto msgstr = match[2].strip;
				assert(msgid !in dictionary);
				if (msgstr != "") {
					dictionary[msgid] = msgstr;
				}
			}

			dictionaries[lang] = dictionary;
		}
		catch (Exception e) {
			e.msg.writeln;
		}
	}

	auto langs = dictionaries.byKey.array;
	langs.sort;

	

	foreach(lang, dictionary; dictionaries.byPair) {
		auto file = chainPath(lang, outFile);
		writeln("Compiling ", file);

		string replacer(Captures!(string) match) {
			auto msgid = match[1].strip;
			switch (msgid) {
				case "LANG":
					return lang;
				case "LANGSELECTOR":
					auto langSelector = `<select id="lang-selector">`;
					foreach (l; langs) {
						langSelector ~= `<option value="`~l~`"`~(l == lang ? `selected` : ``)~`>`~l.toUpper~`</option>`;
					}
					langSelector ~= `</select>`;
					return langSelector;
				default:
					if (auto pStr = msgid in dictionary) {
						return *pStr;
					}
					else {
						if (lang != "en") {
							writeln("Untranslated: ", msgid);
						}
						return msgid;
					}
			}
		}

		auto pattern = regex(`\$\{(.*)\}`); 
		auto output = src.replaceAll!replacer(pattern);

		mkdirRecurse(lang);
		std.file.write(file, output);

	}
}