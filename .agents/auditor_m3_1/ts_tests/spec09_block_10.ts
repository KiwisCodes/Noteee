import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';

export const ENTITLEMENT_PRO = 'pro_subscription';
export const ENTITLEMENT_LIFETIME = 'lifetime_unlock';

export class BillingManager {
  static async configure(apiKey: string, userId: string): Promise<void> {
    Purchases.configure({ apiKey, appUserID: userId });
  }

  static async checkEntitlements(): Promise<{ isPro: boolean; isLifetime: boolean }> {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
    const isPro = typeof customerInfo.entitlements.active[ENTITLEMENT_PRO] !== 'undefined';
    const isLifetime = typeof customerInfo.entitlements.active[ENTITLEMENT_LIFETIME] !== 'undefined';

    return { isPro, isLifetime };
  }

  static async purchaseProPackage(offeringId: string): Promise<boolean> {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) throw new Error('No current offerings available.');

    const pkg = offerings.current.availablePackages.find(p => p.identifier === offeringId);
    if (!pkg) throw new Error(`Package ${offeringId} not found.`);

    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return typeof customerInfo.entitlements.active[ENTITLEMENT_PRO] !== 'undefined';
  }
}