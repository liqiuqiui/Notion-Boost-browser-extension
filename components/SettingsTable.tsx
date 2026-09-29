import { settingDetails, SettingDetail } from './settings';
import { getElement, getLatestSettings } from './utils';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';

function isFuncEnabled(func: any) {
    const btnToDisable = getElement(`[data-func=${func}]`);

    if (btnToDisable && btnToDisable.classList.contains('enable')) {
        return true;
    }
    return false;
}

export function SettingsTable() {
    const { t } = useTranslation();
    const [filterText, setFilterText] = useState('');
    const [settings, setSettings] = useState<SettingDetail[]>(settingDetails);

    useEffect(() => {
        refreshSettings();
    }, []);

    const refreshSettings = () => {
        console.log('refreshing settings');
        const obj = [...settingDetails] as SettingDetail[];

        getLatestSettings()
            .then((set: any) => {
                console.log('LatestSettings: ', set);

                // add current status to settings object
                obj.forEach((e: any) => {
                    e.status = set[e.func] ? 'enable' : 'disable';
                });

                setSettings([...obj]);

                return null;
            })
            .catch((e) => console.log(e));
    };

    const handleFeature = useCallback((obj: any) => {
        console.log('obj', obj);

        console.log('clicked: ');

        const func = obj.func;
        const funcToDisable = obj.disable_func;

        let toEnable = false;

        if (obj.status === 'enable') {
            toEnable = false;
        } else {
            toEnable = true;
        }

        try {
            getLatestSettings()
                .then((set: any) => {
                    console.log('getLatestSettings ->', set);
                    set[func] = toEnable;
                    set.call_func = {
                        name: func,
                        arg: toEnable,
                    };

                    // disable other related func if both are enabled
                    if (funcToDisable && isFuncEnabled(funcToDisable) && toEnable) {
                        set[funcToDisable] = false;
                    }

                    browser.storage.sync.set({ nb_settings: set }).then(() => {
                        refreshSettings();
                    });
                    return null;
                })
                .catch((e) => console.log(e));
        } catch (e) {
            console.log(e);
        }
    }, []);

    // Translate names/descriptions at render time; missing keys fall back to the English text in settings.ts
    const localizedSettings = settings.map((item) => ({
        ...item,
        name: t(`features.${item.func}.name`, { defaultValue: item.name }),
        desc: t(`features.${item.func}.desc`, { defaultValue: item.desc }),
    }));

    const filteredItems = localizedSettings.filter(
        (item) =>
            item.name.toLocaleLowerCase().includes(filterText) || item.desc.toLocaleLowerCase().includes(filterText),
    );
    console.log('filtered items', filteredItems);

    const itemsToDisplay = filterText ? filteredItems : localizedSettings;

    const handleOnchange = (e: any) => {
        console.log('value changed');
        setFilterText(e.target.value.toLocaleLowerCase());
    };
    return (
        <>
            <input
                className="settings search"
                type="text"
                autoFocus
                value={filterText}
                placeholder={t('popup.searchPlaceholder', { defaultValue: 'Search feature...' })}
                onInput={handleOnchange}
            />
            <div className="settings table">
                {!filteredItems.length && (
                    <div className="no-setting">
                        {t('popup.noSettingFound', { defaultValue: 'No setting found' })}
                    </div>
                )}
                {itemsToDisplay.map((obj, index) => (
                    <Fragment key={obj.func}>
                        <div
                            className={`row ${(obj as any).status}`}
                            data-func={obj.func}
                            data-disable_func={obj.disable_func}
                            onClick={() => handleFeature(obj)}>
                            <div className="text-wrapper">
                                <div className="name">{obj.name}</div>
                                {obj.desc && <div className="desc">{obj.desc}</div>}
                            </div>
                            <div
                                className="button toggle"
                                role="button"
                                aria-disabled="false"
                                tabIndex={0}>
                                <div className="knob">
                                    <div className="pos" />
                                </div>
                            </div>
                        </div>
                        {/* {index === settingDetails.length - 1 ? (
                            <div className="divider last" />
                        ) : (
                            <div className="">
                                <div className="" />
                            </div>
                        )} */}
                    </Fragment>
                ))}
            </div>
        </>
    );
}
