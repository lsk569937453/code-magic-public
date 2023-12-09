use quick_xml::events::Event;
use quick_xml::{Reader, Writer};

pub fn format_pretty_json_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let source: serde_json::value::Value =
        serde_json::from_str(&source_string).map_err(|e| anyhow::anyhow!(e))?;
    let res = serde_json::to_string_pretty(&source)?;
    Ok(res)
}
pub fn format_pretty_yaml_with_error(source_string: String) -> Result<String, anyhow::Error> {
    info!("{}", source_string);
    let source: serde_yaml::value::Value =
        serde_yaml::from_str(&source_string).map_err(|e| anyhow::anyhow!(e))?;
    let res = serde_yaml::to_string(&source)?;
    Ok(res)
}
pub fn format_xml_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let mut buf = Vec::new();

    let mut reader = Reader::from_str(&source_string);
    reader.trim_text(true);

    let mut writer = Writer::new_with_indent(Vec::new(), b' ', 2);

    loop {
        let ev = reader.read_event_into(&mut buf);

        match ev {
            Ok(Event::Eof) => break, // exits the loop when reaching end of file
            Ok(event) => writer.write_event(event),
            Err(e) => panic!("Error at position {}: {:?}", reader.buffer_position(), e),
        }?;
        buf.clear();
    }

    let result = std::str::from_utf8(&writer.into_inner())
        .expect("Failed to convert a slice of bytes to a string slice")
        .to_string();

    Ok(result)
}
